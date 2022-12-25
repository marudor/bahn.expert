import { searchStopPlace } from 'server/StopPlace/search';
import tripSearch from './TripSearch';
import type { Route$Auslastung, SingleRoute } from 'types/routing';

async function getRelevantTrip(
  start: string,
  destination: string,
  trainNumber: string,
  time: Date,
): Promise<SingleRoute | undefined> {
  const startStations = await searchStopPlace(start, 1);
  const destStations = await searchStopPlace(destination, 1);

  const startStation = startStations[0];
  const destStation = destStations[0];

  if (!startStation) {
    throw {
      message: 'Start Station unknown',
      data: start,
    };
  }
  if (!destStation) {
    throw {
      message: 'Destination Station unknown',
      data: destination,
    };
  }

  const trips = await tripSearch({
    start: startStation.evaNumber,
    destination: destStation.evaNumber,
    time,
    maxChanges: 0,
  });

  const relevantTrip = trips.routes.find((t) =>
    t.segments.some(
      (s) =>
        s.type === 'JNY' &&
        (s.train.number === trainNumber ||
          Boolean(s.wings?.some((w) => w.train.number === trainNumber))),
    ),
  );

  return relevantTrip;
}

export async function stopOccupancy(
  start: string,
  destination: string,
  trainNumber: string,
  time: Date,
  stopEva: string,
): Promise<Route$Auslastung | undefined> {
  const relevantTrip = await getRelevantTrip(
    start,
    destination,
    trainNumber,
    time,
  );

  if (relevantTrip?.segments[0].type !== 'JNY') {
    return;
  }

  const relevantStop = relevantTrip.segments[0].stops.find(
    (s) => s.station.id === stopEva,
  );

  return relevantStop?.auslastung;
}
