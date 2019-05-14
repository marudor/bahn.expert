import { ParsedCommonArrival, ParsedCommonDeparture } from './common';
import { ParsedProduct, ProdL } from './HAFAS';
import { Station } from './station';

interface CommonStationBoardEntry {
  train: ParsedProduct;
  isCancelled?: boolean;
  finalDestination: string;
  jid: string;
  product?: ProdL;
  currentStation: Station;
}

export interface ArrivalStationBoardEntry extends CommonStationBoardEntry {
  arrival: ParsedCommonArrival;
}

export interface DepartureStationBoardEntry extends CommonStationBoardEntry {
  departure: ParsedCommonDeparture;
}
export type StationBoardEntry<
  type extends 'ARR' | 'DEP' = any
> = type extends 'ARR' ? ArrivalStationBoardEntry : DepartureStationBoardEntry;
