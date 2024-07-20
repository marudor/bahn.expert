import { addIrisMessagesToDetails } from '@/server/journeys/journeyDetails';
import { calculateCurrentStopPlace } from '@/server/HAFAS/Detail';
import {
  differenceInMinutes,
  isAfter,
  isBefore,
  parseISO,
  subHours,
} from 'date-fns';
import { EventType } from '@/external/generated/risJourneysV2';
import { getJourneyDetails } from '@/external/risJourneysV2';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import { getStopPlaceByEva } from '@/server/StopPlace/search';
import {
  type TransportPublicDestinationPortionWorking,
  TransportType,
} from '@/external/generated/risJourneys';
import type { CommonStopInfo } from '@/types/HAFAS';
import type { JourneyEvent } from '@/external/generated/risJourneysV2';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { RouteStop } from '@/types/routing';

interface StopInfoWithAdditional extends CommonStopInfo {
  additional?: boolean;
  travelsWith?: TransportPublicDestinationPortionWorking[];
}

function mapEventToCommonStopInfo(e: JourneyEvent): StopInfoWithAdditional {
  const scheduledTime = parseISO(e.timeSchedule);
  const time = parseISO(e.time);
  // Delay is undefined for scheduled stuff => no real time Information
  const delay =
    e.timeType === 'SCHEDULE'
      ? undefined
      : differenceInMinutes(time, scheduledTime, {
          roundingMethod: 'floor',
        });

  return {
    scheduledTime,
    time,
    cancelled: e.cancelled,
    additional: e.additional,
    delay,
    scheduledPlatform: e.platformSchedule,
    platform: e.platform,
    isRealTime: e.timeType === 'REAL' || undefined,
    travelsWith: e.travelsWith?.map((tw) => ({
      category: tw.category,
      destination: {
        ...tw.destination,
        canceled: Boolean(tw.destination.cancelled),
      },
      differingDestination: tw.separationAt && {
        ...tw.separationAt,
        canceled: Boolean(e.cancelled),
      },
      direction: undefined,
      journeyID: tw.journeyID,
      label: tw.label,
      line: tw.line,
      number: tw.journeyNumber,
      type: Object.values(TransportType).find((t) => t === tw.type)!,
    })),
  };
}

interface JourneyStop extends RouteStop {
  arrival?: StopInfoWithAdditional;
  departure?: StopInfoWithAdditional;
}

function newStopInfoIsAfter(stop: JourneyStop, event: JourneyEvent) {
  const timeSchedule = new Date(event.timeSchedule);
  if (
    event.type === 'ARRIVAL' &&
    stop.departure &&
    isAfter(timeSchedule, stop.departure.scheduledTime)
  ) {
    return false;
  }
  if (
    event.type === EventType.Departure &&
    stop.arrival &&
    isBefore(timeSchedule, stop.arrival.scheduledTime)
  ) {
    return false;
  }
  return true;
}

async function stopsFromEvents(events: JourneyEvent[]): Promise<JourneyStop[]> {
  const stops: JourneyStop[] = [];
  for (const e of events) {
    const stopInfo = mapEventToCommonStopInfo(e);
    const possibleStops = stops.filter(
      (s) =>
        s.station.evaNumber === e.stopPlace.evaNumber &&
        newStopInfoIsAfter(s, e),
    );
    let stop = possibleStops.length ? possibleStops.at(-1) : undefined;

    if (!stop || (stop.arrival && stop.departure)) {
      stop = {
        station: {
          evaNumber: e.stopPlace.evaNumber,
          name: e.stopPlace.name
            .replaceAll('(', ' (')
            .replaceAll(')', ') ')
            .replaceAll('  ', ' ')
            .trim(),
        },
      };
      stops.push(stop);
    }

    stop[e.type === EventType.Arrival ? 'arrival' : 'departure'] = stopInfo;
  }

  const rl100Promise = Promise.all(
    stops.map(async (s) => {
      try {
        const stopPlace = await getStopPlaceByEva(s.station.evaNumber);
        s.station.ril100 = stopPlace?.ril100;
      } catch {
        // we just ignore errors
      }
    }),
  );

  for (const s of stops) {
    if (
      (s.arrival?.cancelled || !s.arrival) &&
      (s.departure?.cancelled || !s.departure)
    ) {
      s.cancelled = true;
    }
    if (
      (s.arrival?.additional || !s.arrival) &&
      (s.departure?.additional || !s.departure)
    ) {
      s.additional = true;
    }

    // mapTravelsWith to split/join
    if (s.arrival?.travelsWith) {
      for (const travelsWith of s.arrival.travelsWith) {
        if (
          !s.departure?.travelsWith?.some(
            (t) => t.journeyID === travelsWith.journeyID,
          )
        ) {
          s.splitsWith = s.splitsWith || [];
          s.splitsWith.push(travelsWith);
        }
      }
    }
    if (s.departure?.travelsWith) {
      for (const travelsWith of s.departure.travelsWith) {
        if (
          !s.arrival?.travelsWith?.some(
            (t) => t.journeyID === travelsWith.journeyID,
          )
        ) {
          s.joinsWith = s.joinsWith || [];
          s.joinsWith.push(travelsWith);
        }
      }
    }
    delete s.departure?.travelsWith;
    delete s.arrival?.travelsWith;
  }

  await rl100Promise;

  return stops;
}

export async function journeyDetails(
  journeyId: string,
): Promise<ParsedSearchOnTripResponse | undefined> {
  const journey = await getJourneyDetails(journeyId);
  if (!journey?.events?.length) {
    return undefined;
  }
  const firstEvent = journey.events[0];

  const stops = await stopsFromEvents(journey.events);
  if (!stops.length) {
    return undefined;
  }
  const firstStop = stops[0];
  const lastStop = stops.at(-1)!;

  const operatorNames = [
    ...new Set(
      journey.events.map((e) => e.transport.administration.operatorName),
    ),
  ].join(', ');

  const result: ParsedSearchOnTripResponse = {
    stops,
    segmentStart: firstStop.station,
    segmentDestination: lastStop.station,
    journeyId: journey.journeyID,
    arrival: lastStop.arrival!,
    departure: firstStop.departure!,
    finalDestination: journey.info.destination.name,
    train: {
      type: firstEvent.transport.category,
      number: firstEvent.transport.journeyNumber.toString(),
      name: `${firstEvent.transport.category} ${
        firstEvent.transport.line || firstEvent.transport.journeyNumber
      }`,
      admin: firstEvent.transport.administration.administrationID,
      line: getLineFromNumber(firstEvent.transport.journeyNumber.toString()),
      transportType: firstEvent.transport.type,
      operator: {
        name: operatorNames,
      },
    },
    type: 'JNY',
    cancelled: stops.every((s) => s.cancelled) || undefined,
  };

  result.currentStop = calculateCurrentStopPlace(result);

  if (isAfter(result.departure.scheduledTime, subHours(new Date(), 20))) {
    await addIrisMessagesToDetails(result);
  }

  return result;
}
