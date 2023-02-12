import { calculateVia } from '@/server/iris/helper';
import type { Abfahrt } from '@/types/iris';
import type {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from '@/types/stationBoard';
import type { Route$Stop } from '@/types/routing';

export interface MappedHafasArrivals {
  [key: string]: ArrivalStationBoardEntry | undefined;
}

const stationMap = (s: Route$Stop) => ({
  name: s.station.title,
  cancelled: s.cancelled,
  additional: s.additional,
});

const mapDepartureRoute = (departureRoute: Route$Stop[]) => {
  const mapped = departureRoute.map(stationMap);

  calculateVia(mapped.slice(1));

  return mapped;
};

export default (
  j: DepartureStationBoardEntry,
  hafasArrivals: MappedHafasArrivals,
  idSet: Set<string>,
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
    for (const s of j.stops)
      s.station.title = s.station.title.replace(townSuffix, '');
  }

  return {
    initialDeparture: j.stops[0].departure!.scheduledTime,
    initialStopPlace: j.stops[0].station.id,
    arrival: matchingArrival?.arrival,
    departure: j.departure,
    currentStopPlace: {
      name: j.currentStation.title,
      evaNumber: j.currentStation.id,
    },
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
          head: m.txtS || 'Information',
          value: -1,
        })) || [],
    },
    platform: j.departure.platform ?? '',
    scheduledPlatform: j.departure.scheduledPlatform ?? '',
    route: [...arrivalRoute, ...mapDepartureRoute(j.stops)],
    train: {
      type: '',
      number: '',
      ...j.train,
    },
  };
};
