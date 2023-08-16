import { calculateCurrentStopPlace } from '@/server/HAFAS/Detail';
import {
  compareDesc,
  differenceInMinutes,
  isAfter,
  isBefore,
  parseISO,
  subHours,
  subMinutes,
} from 'date-fns';
import { EventType, TimeType } from '@/external/generated/risJourneys';
import { getAbfahrten } from '@/server/iris';
import { getJourneyDetails } from '@/external/risJourneys';
import { getLineFromNumber } from '@/server/journeys/lineNumberMapping';
import { getSingleTrainRun } from '@/server/coachSequence/DB/trainRuns';
import type {
  ArrivalDepartureEvent,
  TransportPublicDestinationPortionWorking,
} from '@/external/generated/risJourneys';
import type { CommonStopInfo } from '@/types/HAFAS';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { Route$Stop } from '@/types/routing';
import type { TrainRun } from '@/types/trainRuns';

const trainNumberRegex = /(.*?)(\d+).*/;

export async function addIrisMessagesToDetails(
  details: ParsedSearchOnTripResponse,
): Promise<void> {
  const irisStop = details.currentStop || details.stops.at(-1);

  if (irisStop) {
    const stopInfo = irisStop.departure || irisStop.arrival;

    if (stopInfo) {
      try {
        const irisData = await getAbfahrten(
          irisStop.station.evaNumber,
          false,
          {
            lookahead: 10,
            lookbehind: 0,
            startTime: subMinutes(stopInfo.scheduledTime, 5),
          },
          true,
        );

        const irisDeparture = irisData.departures.find(
          (a) => a.train.name === details.train.name,
        );

        if (irisDeparture) {
          const irisMessages = [
            ...irisDeparture.messages.delay,
            ...irisDeparture.messages.qos,
            ...irisDeparture.messages.him,
          ].sort((m1, m2) => compareDesc(m1.timestamp!, m2.timestamp!));
          irisStop.irisMessages = irisMessages;
        }
      } catch {
        // ignore
      }
    }
  }
}

export function getCategoryAndNumberFromName(trainName: string):
  | {
      trainNumber: number;
      category?: string;
    }
  | undefined {
  const regexResult = trainNumberRegex.exec(trainName);
  const trainNumber = Number.parseInt(regexResult?.[2].trim() || '');
  const category = regexResult?.[1]?.trim();

  if (!Number.isNaN(trainNumber)) {
    return {
      trainNumber,
      category: category?.length ? category : undefined,
    };
  }
}

interface StopInfoWithAdditional extends CommonStopInfo {
  additional?: boolean;
  travelsWith?: TransportPublicDestinationPortionWorking[];
}

function mapEventToCommonStopInfo(
  e: ArrivalDepartureEvent,
): StopInfoWithAdditional {
  const scheduledTime = parseISO(e.timeSchedule);
  const time = parseISO(e.time);
  // Delay is undefined for scheduled stuff => no real time Information
  const delay =
    e.timeType === TimeType.Schedule
      ? undefined
      : differenceInMinutes(time, scheduledTime);

  return {
    scheduledTime,
    time,
    cancelled: e.canceled,
    additional: e.additional,
    delay,
    scheduledPlatform: e.platformSchedule,
    platform: e.platform,
    isRealTime: e.timeType === 'REAL' || undefined,
    travelsWith: e.travelsWith,
  };
}

interface JourneyStop extends Route$Stop {
  arrival?: StopInfoWithAdditional;
  departure?: StopInfoWithAdditional;
}

function newStopInfoIsAfter(stop: JourneyStop, event: ArrivalDepartureEvent) {
  const timeSchedule = new Date(event.timeSchedule);
  if (
    event.type === EventType.Arrival &&
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

function stopsFromEvents(events: ArrivalDepartureEvent[], trainRun?: TrainRun) {
  const stops: JourneyStop[] = [];
  for (const e of events) {
    const stopInfo = mapEventToCommonStopInfo(e);
    const possibleStops = stops.filter(
      (s) =>
        s.station.evaNumber === e.station.evaNumber && newStopInfoIsAfter(s, e),
    );
    let stop = possibleStops.length ? possibleStops.at(-1) : undefined;

    if (!stop || (stop.arrival && stop.departure)) {
      stop = {
        station: {
          evaNumber: e.station.evaNumber,
          name: e.station.name
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

  if (trainRun && stops.length) {
    const firstStop = stops[0];
    const firstTrainRunStop = trainRun.via.find(
      (stop) => stop.evaNumber === firstStop.station.evaNumber,
    );
    if (
      firstTrainRunStop?.arrivalTime &&
      !firstStop.arrival &&
      firstStop.departure &&
      isBefore(firstTrainRunStop.arrivalTime, firstStop.departure.scheduledTime)
    ) {
      firstStop.arrival = {
        isPlan: true,
        scheduledTime: firstTrainRunStop.arrivalTime,
        time: firstTrainRunStop.arrivalTime,
      };
    }

    // Abfahrt am Ziel zeigen wir erst mal nicht, das ist regelmässig vor PlanAnkunft
    // const lastStop = stops.at(-1)!;
    // const lastTrainRunStop = trainRun.via.findLast(
    //   (stop) => stop.evaNumber === lastStop?.station.evaNumber,
    // );
    // if (lastTrainRunStop?.departureTime && !lastStop.departure) {
    //   lastStop.departure = {
    //     isPlan: true,
    //     scheduledTime: lastTrainRunStop.departureTime,
    //     time: lastTrainRunStop.departureTime,
    //   };
    // }
  }

  return stops;
}

export async function journeyDetails(
  journeyId: string,
): Promise<ParsedSearchOnTripResponse | undefined> {
  const journey = await getJourneyDetails(journeyId);
  if (!journey) {
    return undefined;
  }
  if (!journey.events.length) {
    return undefined;
  }
  const firstEvent = journey.events[0];
  const initialDeparture = new Date(firstEvent.timeSchedule);
  const trainRun = await getSingleTrainRun(
    initialDeparture,
    firstEvent.transport.number.toString(),
  );

  const stops = stopsFromEvents(journey.events, trainRun);
  if (!stops.length) {
    return undefined;
  }
  const firstStop = stops[0];
  const lastStop = stops.at(-1)!;

  const operatorNames = [
    ...new Set(journey.events.map((e) => e.administration.operatorName)),
  ].join(', ');

  const result: ParsedSearchOnTripResponse = {
    stops,
    segmentStart: firstStop.station,
    segmentDestination: lastStop.station,
    jid: journey.journeyID,
    arrival: lastStop.arrival!,
    departure: firstStop.departure!,
    finalDestination: journey.destinationSchedule.name,
    train: {
      type: firstEvent.transport.category,
      number: firstEvent.transport.number.toString(),
      name: `${firstEvent.transport.category} ${
        firstEvent.transport.line || firstEvent.transport.number
      }`,
      admin: firstEvent.administration.administrationID,
      line: getLineFromNumber(firstEvent.transport.number.toString()),
      operator: {
        name: operatorNames,
        icoX: 0,
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
