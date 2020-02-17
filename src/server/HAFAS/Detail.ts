import { AllowedHafasProfile } from 'types/HAFAS';
import { getAbfahrten } from 'server/Abfahrten';
import { getPlannedSequence } from 'server/Reihung/plan';
import { logger } from 'server/logger';
import { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import { Route$JourneySegmentTrain } from 'types/routing';
import { subMinutes } from 'date-fns';
import createCtxRecon from 'server/HAFAS/helper/createCtxRecon';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import JourneyMatch from 'server/HAFAS/JourneyMatch';
import searchOnTrip from './SearchOnTrip';

function calculateCurrentStation(
  segment: ParsedSearchOnTripResponse,
  currentStopId?: string
) {
  const currentDate = Date.now();
  let currentStop;

  if (currentStopId) {
    currentStop = segment.stops.find(s => s.station.id === currentStopId);
  }

  if (!currentStop) {
    currentStop = segment.stops.find(s => {
      const stopInfo = s.departure || s.arrival;

      return stopInfo && !stopInfo.cancelled && stopInfo.time > currentDate;
    });
  }

  return currentStop;
}

export default async (
  trainName: string,
  currentStopId?: string,
  station?: string,
  date: number = Date.now(),
  hafasProfile: AllowedHafasProfile = AllowedHafasProfile.DB
): Promise<ParsedSearchOnTripResponse | undefined> => {
  let possibleTrains: undefined | ParsedJourneyMatchResponse[];

  if (station) {
    try {
      possibleTrains = await JourneyMatch({
        trainName,
        initialDepartureDate: date,
        jnyFltrL: [
          {
            type: 'STATIONS',
            mode: 'INC',
            value: station,
          },
        ],
      });
    } catch {
      // ignore
    }
  }

  if (!possibleTrains) {
    possibleTrains = await JourneyMatch(
      {
        trainName,
        initialDepartureDate: date,
      },
      hafasProfile
    );
  }

  // possibleTrains.sort(t1 =>
  //   t1.firstStop.station.id.startsWith('80') ||
  //   t1.lastStop.station.id.startsWith('80')
  //     ? -1
  //     : 1
  // );
  const train: ParsedJourneyMatchResponse | undefined = possibleTrains[0];

  if (!train) return undefined;

  const journeyDetails = await JourneyDetails(train.jid, hafasProfile);

  if (!journeyDetails) return undefined;

  let relevantSegment: ParsedSearchOnTripResponse;

  try {
    const route = await searchOnTrip(
      {
        ctxRecon: createCtxRecon({
          firstStop: journeyDetails.firstStop,
          lastStop: journeyDetails.lastStop,
          trainName: journeyDetails.train.name,
          messages: journeyDetails.messages,
        }),
        sotMode: 'RC',
      },
      hafasProfile
    );

    relevantSegment = route.segments.find(
      s => s.type === 'JNY'
    ) as Route$JourneySegmentTrain;
  } catch (e) {
    logger.error({
      msg: 'HAFAS Error',
      error: e,
    });

    relevantSegment = {
      type: 'JNY',
      cancelled: journeyDetails.stops.every(s => s.cancelled),
      finalDestination: journeyDetails.lastStop.station.title,
      jid: train.jid,
      train: journeyDetails.train,
      segmentDestination: journeyDetails.lastStop.station,
      segmentStart: journeyDetails.firstStop.station,
      stops: journeyDetails.stops,
      messages: journeyDetails.messages,
      arrival: journeyDetails.lastStop.arrival,
      departure: journeyDetails.firstStop.departure,
      plannedSequence: getPlannedSequence(train.train),
    };
  }

  if (relevantSegment.stops.length !== journeyDetails.stops.length) {
    journeyDetails.stops.forEach((stop, index) => {
      if (stop.additional) {
        relevantSegment.stops.splice(index, 0, stop);
      }
    });
  }

  const lastStop = relevantSegment.stops
    .filter(s => s.arrival && !s.arrival.cancelled)
    .pop();

  if (currentStopId) {
    relevantSegment.currentStop = relevantSegment.stops.find(
      s => s.station.id === currentStopId
    );
  }

  if (!lastStop || !lastStop.arrival || lastStop.arrival.delay == null) {
    relevantSegment.stops.forEach((stop, index) => {
      const jDetailStop = journeyDetails.stops[index];

      if (jDetailStop.station.id !== stop.station.id) return;
      if (jDetailStop.arrival && stop.arrival) {
        stop.arrival.delay = jDetailStop.arrival.delay;
        stop.arrival.time = jDetailStop.arrival.time;
      }
      if (jDetailStop.departure && stop.departure) {
        stop.departure.delay = jDetailStop.departure.delay;
        stop.departure.time = jDetailStop.departure.time;
      }
    });
  }

  relevantSegment.currentStop = calculateCurrentStation(
    relevantSegment,
    currentStopId
  );

  const irisStop =
    relevantSegment.currentStop ||
    relevantSegment.stops[relevantSegment.stops.length - 1];

  if (irisStop) {
    const stopInfo = irisStop.departure || irisStop.arrival;

    if (stopInfo) {
      try {
        const irisData = await getAbfahrten(irisStop.station.id, false, {
          lookahead: 10,
          lookbehind: 0,
          currentDate: subMinutes(stopInfo.scheduledTime, 5),
        });

        const irisDeparture = irisData.departures.find(
          a => a.train.name === relevantSegment.train.name
        );

        if (irisDeparture) {
          // if (irisDeparture.arrival && irisStop.arrival) {
          //   irisDeparture.arrival.reihung = irisStop.arrival.reihung;
          // }
          // if (irisDeparture.departure && irisStop.departure) {
          //   irisDeparture.departure.reihung = irisStop.departure.reihung;
          // }

          irisStop.irisMessages = irisDeparture.messages.delay
            .concat(irisDeparture.messages.qos)
            .concat(irisDeparture.messages.him);
        }
      } catch {
        // ignore
      }
    }
  }

  return relevantSegment;
};
