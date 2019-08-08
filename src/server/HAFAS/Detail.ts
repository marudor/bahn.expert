import { AllowedHafasProfile } from 'types/HAFAS';
import { format, subMinutes } from 'date-fns';
import { getAbfahrten } from 'server/Abfahrten';
import { logger } from 'server/logger';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import journeyDetails from './JourneyDetails';
import journeyMatch from './JourneyMatch';
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
  date: number = Date.now(),
  hafasProfile: AllowedHafasProfile = 'db'
) => {
  const train = (await journeyMatch(trainName, date, hafasProfile))[0];

  if (!train) return undefined;

  const jDetails = await journeyDetails(train.jid, hafasProfile);

  let replacementNumber = 1;

  if (
    jDetails.messages &&
    jDetails.messages.some(m => m.txtN.includes('Ersatzfahrt'))
  ) {
    replacementNumber = 2;
  }

  const ctxRecon = `¶HKI¶T$A=1@L=${
    jDetails.firstStop.station.id
  }@a=128@$A=1@L=${jDetails.lastStop.station.id}@a=128@$${format(
    jDetails.firstStop.departure.scheduledTime,
    'yyyyMMddHHmm'
  )}$${format(jDetails.lastStop.arrival.scheduledTime, 'yyyyMMddHHmm')}$${
    jDetails.train.name
  }$$${replacementNumber}$`;

  let relevantSegment: ParsedSearchOnTripResponse;

  try {
    const route = await searchOnTrip(ctxRecon, hafasProfile);

    relevantSegment = route.segments[0];
  } catch (e) {
    logger.error({
      msg: 'HAFAS Error',
      error: e,
    });

    relevantSegment = {
      cancelled: jDetails.stops.every(s => s.cancelled),
      finalDestination: jDetails.lastStop.station.title,
      jid: train.jid,
      train: jDetails.train,
      segmentDestination: jDetails.lastStop.station,
      segmentStart: jDetails.firstStop.station,
      stops: jDetails.stops,
      messages: jDetails.messages,
      arrival: jDetails.lastStop.arrival,
      departure: jDetails.firstStop.departure,
    };
  }

  if (relevantSegment.stops.length !== jDetails.stops.length) {
    jDetails.stops.forEach((stop, index) => {
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
      const jDetailStop = jDetails.stops[index];

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
      const irisData = await getAbfahrten(irisStop.station.id, false, {
        lookahead: 10,
        lookbehind: 0,
        currentDate: subMinutes(stopInfo.scheduledTime, 5),
        skipLageplan: true,
      });

      const irisDeparture = irisData.departures.find(
        a => a.train.name === relevantSegment.train.name
      );

      if (irisDeparture) {
        if (irisDeparture.arrival && irisStop.arrival) {
          irisDeparture.arrival.reihung = irisStop.arrival.reihung;
          irisStop.arrival = irisDeparture.arrival;
        }
        if (irisDeparture.departure && irisStop.departure) {
          irisDeparture.departure.reihung = irisStop.departure.reihung;
          irisStop.departure = irisDeparture.departure;
        }

        irisStop.irisMessages = irisDeparture.messages.delay.concat(
          irisDeparture.messages.qos
        );
      }
    }
  }

  return relevantSegment;
};
