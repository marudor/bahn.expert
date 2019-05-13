import { Common, CommonArrival, CommonDeparture, CommonJny, LocL } from '.';

export interface StationBoardRequest<t extends 'DEP' | 'ARR' = any> {
  req: {
    type: t;
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
export type StationBoardResponse<
  t extends 'DEP' | 'ARR' = any
> = t extends 'ARR'
  ? ArrivalStationBoardResponse
  : DepartureStationBoardResponse;

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
export type Jny<t extends 'ARR' | 'DEP' = any> = t extends 'ARR'
  ? ArrivalJny
  : DepartureJny;
