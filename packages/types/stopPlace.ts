import type {
  Coordinate2D,
  TransportType,
} from 'business-hub/types/RisStations';

export interface StopPlaceIdentifier {
  stationId?: string;
  /** also known as DHID, globalId */
  ifopt?: string;
  ril100?: string;
  alternativeRil100?: string[];
}

export interface GroupedStopPlace {
  evaNumber: string;
  name: string;
  availableTransports: TransportType[];
  position?: Coordinate2D;
  identifier?: StopPlaceIdentifier;
}

export type MinimalStopPlace = Pick<GroupedStopPlace, 'name' | 'evaNumber'>;
