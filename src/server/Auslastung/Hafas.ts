import { StationSearchType } from 'Common/config';
import stationSearch from '../Search';
import tripSearch from '../HAFAS/TripSearch';

export default async (
  start: string,
  destination: string,
  trainNumber: string,
  time: number
) => {
  const [startStations, destStations] = await Promise.all([
    stationSearch(start, StationSearchType.DBNavgiator),
    stationSearch(destination, StationSearchType.DBNavgiator),
  ]);

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

  const relevantTrip = trips.find(t =>
    Boolean(
      t.segments.find(
        s =>
          s.trainNumber === trainNumber ||
          Boolean(s.wings && s.wings.find(w => w.trainNumber === trainNumber))
      )
    )
  );

  if (!relevantTrip) {
    throw {
      status: 404,
      message: 'Auslastung not found',
    };
  }

  return relevantTrip.segments[0].auslastung;
};
