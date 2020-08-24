import { StationSearchType } from 'types/station';
import stationSearch from '../Search';
import tripSearch from '../HAFAS/TripSearch';

export default async (
  start: string,
  destination: string,
  trainNumber: string,
  time: number,
) => {
  const startStations = await stationSearch(start, StationSearchType.hafas);
  const destStations = await stationSearch(
    destination,
    StationSearchType.hafas,
  );

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
    start: startStation.id,
    destination: destStation.id,
    time,
    getPasslist: false,
    maxChanges: 0,
  });

  const relevantTrip = trips.routes.find((t) =>
    Boolean(
      t.segments.find(
        (s) =>
          s.type === 'JNY' &&
          (s.train.number === trainNumber ||
            Boolean(
              s.wings && s.wings.find((w) => w.train.number === trainNumber),
            )),
      ),
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
