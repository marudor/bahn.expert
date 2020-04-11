import { Abfahrt } from 'types/iris';
import {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from 'types/stationBoard';
import { Route$Stop } from 'types/routing';

export interface MappedHafasArrivals {
  [key: string]: ArrivalStationBoardEntry | undefined;
}

const stationMap = (s: Route$Stop) => ({
  name: s.station.title,
  cancelled: s.cancelled,
  additional: s.additional,
});

export default (
  j: DepartureStationBoardEntry,
  hafasArrivals: MappedHafasArrivals,
  idSet: Set<string>
): Abfahrt | void => {
  if (!j.stops) return;

  const id = `${j.jid}${j.train.number}`;

  if (idSet.has(id)) return;
  idSet.add(id);
  const matchingArrival = hafasArrivals[id];
  const arrivalRoute = matchingArrival?.stops?.map(stationMap) || [];

  arrivalRoute.pop();
  const splittedName = j.stops[0].station.title.split(',');
  const townSuffix = `,${splittedName[splittedName.length - 1]}`;

  if (j.stops.every((s) => s.station.title.endsWith(townSuffix))) {
    j.stops.forEach(
      (s) => (s.station.title = s.station.title.replace(townSuffix, ''))
    );
  }

  return {
    initialDeparture: j.stops[0].departure!.scheduledTime,
    arrival: matchingArrival?.arrival,
    departure: j.departure,
    auslastung: false,
    currentStation: j.currentStation,
    destination: j.finalDestination,
    scheduledDestination: j.finalDestination,
    id,
    cancelled: j.cancelled,
    rawId: id,
    mediumId: id,
    productClass: '',
    messages: {
      qos: [],
      delay: [],
      him:
        j.messages?.map((m) => ({
          text: m.txtN,
          head: !m.txtS
            ? 'Information'
            : m.txtS.includes('Information')
            ? 'Information'
            : m.txtS.includes('Großstörung')
            ? 'Großstörung'
            : m.txtS.includes('Störung')
            ? 'Störung'
            : m.txtS,
          timestamp: 0,
        })) || [],
    },
    platform: j.departure.platform ?? '',
    scheduledPlatform: j.departure.scheduledPlatform ?? '',
    reihung: false,
    route: [...arrivalRoute, ...j.stops.map(stationMap)],
    train: {
      type: '',
      number: '',
      ...j.train,
    },
  };
};
