import { calculateVia } from '@/server/iris/helper';
import type { Abfahrt } from '@/types/iris';
import type {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from '@/types/stationBoard';
import type { Route$Stop } from '@/types/routing';

export type MappedHafasArrivals = Record<
  string,
  ArrivalStationBoardEntry | undefined
>;

const stationMap = (s: Route$Stop) => ({
  name: s.station.name,
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
  const splittedName = j.stops[0].station.name.split(',');
  const townSuffix = `,${splittedName.at(-1)}`;

  if (j.stops.every((s) => s.station.name.endsWith(townSuffix))) {
    for (const s of j.stops)
      s.station.name = s.station.name.replace(townSuffix, '');
  }

  return {
    initialDeparture: j.stops[0].departure!.scheduledTime,
    initialStopPlace: j.stops[0].station.evaNumber,
    arrival: matchingArrival?.arrival,
    departure: j.departure,
    currentStopPlace: {
      name: j.currentStation.name,
      evaNumber: j.currentStation.evaNumber,
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
