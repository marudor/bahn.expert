import {
  ParsedCommonArrival,
  ParsedCommonDeparture,
  ParsedProduct,
  ProdL,
} from './HAFAS';
import { Station } from './station';

interface CommonStationBoardEntry extends ParsedProduct {
  isCancelled?: boolean;
  finalDestination: string;
  jid: string;
  product?: ProdL;
  currentStation: Station;
}

export interface ArrivalStationBoardEntry
  extends ParsedCommonArrival,
    CommonStationBoardEntry {}

export interface DepartureStationBoardEntry
  extends ParsedCommonDeparture,
    CommonStationBoardEntry {}
export type StationBoardEntry<
  type extends 'ARR' | 'DEP' = any
> = type extends 'ARR' ? ArrivalStationBoardEntry : DepartureStationBoardEntry;
