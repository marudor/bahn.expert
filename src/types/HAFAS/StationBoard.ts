import type {
  Common,
  CommonArrival,
  CommonDeparture,
  CommonJny,
  GenericHafasRequest,
  JourneyFilter,
  OptionalLocL,
} from '.';

export const enum StationBoardSortType {
  EVAID = 'EVAID',
  PT = 'PT',
  RT = 'RT',
}

interface StationBoardRequestReq {
  type: 'DEP' | 'ARR';
  date: string;
  dateB?: string;
  dateE?: string;
  dur?: number;
  getPasslist?: boolean;
  getSimpleTrainComposition?: boolean;
  getTrainComposition?: boolean;
  time: string;
  stbLoc: OptionalLocL;
  dirLoc?: OptionalLocL;
  jnyFltrL?: JourneyFilter[];
  locFltrL?: any[];
  maxJny?: number;
  minDur?: number;
  per?: boolean;
  qrCode?: string;
  sort?: StationBoardSortType;
  stbFltrEquiv?: boolean;
}

export interface StationBoardRequest
  extends GenericHafasRequest<'StationBoard', StationBoardRequestReq> {}
export interface CommonStationBoardResponse {
  common: Common;
  fpB: string;
  fpE: string;
  planrtTS: string;
  sD: string;
  sT: string;
  locRefL: number[];
}
export interface ArrivalStationBoardResponse
  extends CommonStationBoardResponse {
  type: 'ARR';
  jnyL: ArrivalJny[];
}
export interface DepartureStationBoardResponse
  extends CommonStationBoardResponse {
  type: 'DEP';
  jnyL: DepartureJny[];
}
export type StationBoardResponse =
  | ArrivalStationBoardResponse
  | DepartureStationBoardResponse;

export type DepStbStop = CommonDeparture;

export type ArrStbStop = CommonArrival;

export interface ArrivalJny extends CommonJny {
  date: string;
  stbStop: ArrStbStop;
}
export interface DepartureJny extends CommonJny {
  date: string;
  stbStop: DepStbStop;
}

export type StationBoardJny = ArrivalJny | DepartureJny;
