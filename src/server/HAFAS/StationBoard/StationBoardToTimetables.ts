import { Abfahrt } from 'types/iris';
import { StationBoardEntry } from 'types/stationBoard';

export default (j: StationBoardEntry): Abfahrt | void => {
  if (!j.stops) return;

  const arrival = 'arrival' in j ? j.arrival : undefined;
  const departure = 'departure' in j ? j.departure : undefined;

  const splittedName = j.stops[0].station.title.split(',');
  const townSuffix = `,${splittedName[splittedName.length - 1]}`;

  if (j.stops.every((s) => s.station.title.endsWith(townSuffix))) {
    j.stops.forEach(
      (s) => (s.station.title = s.station.title.replace(townSuffix, ''))
    );
  }

  return {
    initialDeparture: j.stops[0].departure!.scheduledTime,
    arrival,
    departure,
    auslastung: false,
    currentStation: j.currentStation,
    destination: j.finalDestination,
    scheduledDestination: j.finalDestination,
    id: j.jid,
    cancelled: j.cancelled,
    rawId: j.jid,
    mediumId: j.jid,
    productClass: '',
    messages: {
      qos: [],
      delay: [],
      him: [],
    },
    platform: (departure || arrival)?.platform ?? '',
    scheduledPlatform: (departure || arrival)?.scheduledPlatform ?? '',
    reihung: false,
    route: j.stops.map((s) => ({
      name: s.station.title,
      cancelled: s.cancelled,
      additional: s.additional,
    })),
    train: {
      type: '',
      number: '',
      ...j.train,
    },
  };
};
