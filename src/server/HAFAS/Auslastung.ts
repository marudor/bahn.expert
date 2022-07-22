import { searchStopPlace } from 'server/StopPlace/search';
import tripSearch from '../HAFAS/TripSearch';
import type { Route$Auslastung } from 'types/routing';

export default async (
  start: string,
  destination: string,
  trainNumber: string,
  time: Date,
): Promise<Route$Auslastung | undefined> => {
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
    getPasslist: false,
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

  if (
    !relevantTrip ||
    relevantTrip.segments[0].type !== 'JNY' ||
    !relevantTrip.segments[0].auslastung
  ) {
    throw {
      status: 404,
      message: 'Auslastung not found',
    };
  }

  return relevantTrip.segments[0].auslastung;
};
