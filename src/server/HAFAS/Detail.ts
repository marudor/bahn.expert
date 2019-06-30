import { AllowedHafasProfile } from 'types/HAFAS';
import searchOnTrip from './SearchOnTrip';
import trainSearch from './TrainSearch';

export default async (
  trainName: string,
  date: number = Date.now(),
  hafasProfile: AllowedHafasProfile = 'db'
) => {
  const trains = await trainSearch(trainName, date, hafasProfile);
  const train = trains[0];

  if (!train) return undefined;

  const route = await searchOnTrip(train.ctxRecon, hafasProfile);

  const relevantSegment = route.segments[0];

  const lastStop = relevantSegment.stops
    .filter(s => s.arrival && !s.arrival.cancelled)
    .pop();

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
