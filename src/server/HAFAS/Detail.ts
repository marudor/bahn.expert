import { AllowedHafasProfile } from 'types/HAFAS';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import searchOnTrip from './SearchOnTrip';
import trainSearch from './TrainSearch';

export default async (
  trainName: string,
  currentStopId?: string,
  date: number = Date.now(),
  hafasProfile: AllowedHafasProfile = 'db'
) => {
  const trains = await trainSearch(trainName, date, hafasProfile);
  const train = trains[0];

  if (!train) return undefined;

  const route = await searchOnTrip(train.ctxRecon, hafasProfile);

  const relevantSegment: ParsedSearchOnTripResponse = route.segments[0];

  const lastStop = relevantSegment.stops
    .filter(s => s.arrival && !s.arrival.cancelled)
    .pop();

  let currentStop;

  if (currentStopId) {
    currentStop = relevantSegment.stops.find(
      s => s.station.id === currentStopId
    );
  }
  if (!currentStop) {
    const currentDate = Date.now();

    currentStop = relevantSegment.stops.find(s => {
      const stopInfo = s.departure || s.arrival;

      return stopInfo && stopInfo.time > currentDate;
    });
  }

  relevantSegment.currentStop = currentStop;

  if (lastStop && lastStop.arrival && lastStop.arrival.delay != null) {
    return relevantSegment;
  }

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

  return relevantSegment;
};
