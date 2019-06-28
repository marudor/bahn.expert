import { ParsedCommonArrival, ParsedCommonDeparture } from './common';
import { ParsedProduct } from './HAFAS';

interface CommonStationBoardEntry {
  train: ParsedProduct;
  isCancelled?: boolean;
  finalDestination: string;
  jid: string;
}

export interface ArrivalStationBoardEntry extends CommonStationBoardEntry {
  arrival: ParsedCommonArrival;
}

export interface DepartureStationBoardEntry extends CommonStationBoardEntry {
  departure: ParsedCommonDeparture;
}
export type StationBoardEntry =
  | ArrivalStationBoardEntry
  | DepartureStationBoardEntry;
