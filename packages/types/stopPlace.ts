import type {
  Coordinate2D,
  TransportType,
} from 'business-hub/types/RisStations';
import type { Route$Auslastung } from 'types/routing';

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

export interface TrainOccupancy<T> {
  train: TrainOccupancyList<T>;
}

export interface TrainOccupancyList<T = Route$Auslastung> {
  [trainNumber: string]: T | null;
}

export interface VRRTrainOccupancy {
  /**
   * 1: Many Seats available<br>
   * 2: Few Seaths available<br>
   * 3: Standing only<br>
   * null: no data
   */
  occupancy: VRRTrainOccupancyValues | null;
}

export type VRRTrainOccupancyValues = 1 | 2 | 3;
