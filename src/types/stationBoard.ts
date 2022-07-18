import type {
  CommonStopInfo,
  HafasStation,
  ParsedProduct,
  RemL,
} from './HAFAS';
import type { Route$Stop } from 'types/routing';

interface CommonStationBoardEntry {
  train: ParsedProduct;
  cancelled?: boolean;
  finalDestination: string;
  jid: string;
  stops?: Route$Stop[];
  currentStation: HafasStation;
  messages?: RemL[];
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
