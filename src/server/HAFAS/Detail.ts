import { AllowedHafasProfile } from 'types/HAFAS';
import { getAbfahrten } from 'server/Abfahrten';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import { subMinutes } from 'date-fns';
import searchOnTrip from './SearchOnTrip';
import trainSearch from './TrainSearch';

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
  const train = await trainSearch(trainName, date, hafasProfile);

  if (!train) return undefined;

  const route = await searchOnTrip(train.ctxRecon, hafasProfile);

  const relevantSegment: ParsedSearchOnTripResponse = route.segments[0];

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
      const jDetailStop = train.jDetails.stops[index];

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
