import type {
  CommonStopInfo,
  HafasStation,
  ParsedProduct,
  RemL,
} from './HAFAS';
import type { Route$Stop } from 'types/routing';

interface CommonStationBoardEntry<DateType = Date> {
  train: ParsedProduct;
  cancelled?: boolean;
  finalDestination: string;
  jid: string;
  stops?: Route$Stop<DateType>[];
  currentStation: HafasStation;
  messages?: RemL[];
}

export interface ArrivalStationBoardEntry<DateType = Date>
  extends CommonStationBoardEntry<DateType> {
  arrival: CommonStopInfo<DateType>;
}

export interface DepartureStationBoardEntry<DateType = Date>
  extends CommonStationBoardEntry<DateType> {
  departure: CommonStopInfo<DateType>;
}
export type StationBoardEntry<DateType = Date> =
  | ArrivalStationBoardEntry<DateType>
  | DepartureStationBoardEntry<DateType>;
