import { Common, LocL, CommonJny } from '.';

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

export interface StationBoardResponse {
  common: Common;
  fpB: string;
  fpE: string;
  planrtTS: string;
  sD: string;
  sT: string;
  locRefL: number[];
  type: 'DEP' | 'ARR';
  jnyL: Jny[];
}

export interface StbStop {
  locX: number;
  idx: number;
  dProdX: number;
  dInR: boolean;
  dTimeS: string;
  dTimeR?: string;
  dPlatfS?: string;
  dPlatfR?: string;
  dProgType?: string;
  type: string;
}

export interface Jny extends CommonJny {
  stbStop: StbStop;
}
