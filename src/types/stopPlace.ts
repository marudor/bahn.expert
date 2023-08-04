import type { Coordinate2D, TransportType } from '@/external/types';
import type { Route$Auslastung } from '@/types/routing';

export interface StopPlaceIdentifier {
  stationId?: string;
  /** also known as DHID, globalId */
  ifopt?: string;
  ril100?: string;
  alternativeRil100?: string[];
  evaNumber: string;
  uic?: string;
}

export interface GroupedStopPlace {
  evaNumber: string;
  name: string;
  availableTransports: TransportType[];
  position?: Coordinate2D;
  ifopt?: string;
  ril100?: string;
  alternativeRil100?: string[];
  stationId?: string;
  uic?: string;
}

export type MinimalStopPlace = Pick<
  GroupedStopPlace,
  'name' | 'evaNumber' | 'ril100'
>;

export interface TrainOccupancy<out T> {
  train: TrainOccupancyList<T>;
}

export type TrainOccupancyList<out T = Route$Auslastung> = Record<
  string,
  T | null
>;

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
