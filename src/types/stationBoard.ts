import { CommonStopInfo } from './api/common';
import { ParsedProduct } from './HAFAS';

interface CommonStationBoardEntry {
  train: ParsedProduct;
  cancelled?: boolean;
  finalDestination: string;
  jid: string;
}

export interface ArrivalStationBoardEntry extends CommonStationBoardEntry {
  arrival: CommonStopInfo;
}

export interface DepartureStationBoardEntry extends CommonStationBoardEntry {
  departure: CommonStopInfo;
}
export type StationBoardEntry =
  | ArrivalStationBoardEntry
  | DepartureStationBoardEntry;
