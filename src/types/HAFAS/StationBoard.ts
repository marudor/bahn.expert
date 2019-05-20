import { Common, CommonArrival, CommonDeparture, CommonJny, LocL } from '.';

export interface StationBoardRequest {
  req: {
    type: 'DEP' | 'ARR';
    date: string;
    time: string;
    stbLoc: Partial<LocL>;
    dirLoc?: Partial<LocL>;
    jnyFltrL?: any[];
  };
  meth: 'StationBoard';
}
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

export type Jny = ArrivalJny | DepartureJny;
