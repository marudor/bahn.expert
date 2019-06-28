import { Common, CommonStop, MsgL, TrnCmpSX } from '.';

export interface TxtC {
  r: number;
  g: number;
  b: number;
}

export interface SDaysL {
  sDaysR: string;
  sDaysI: string;
  sDaysB: string;
  fLocX: number;
  tLocX: number;
}

export interface PolyG {
  polyXL: number[];
  layerX: number;
  crdSysX: number;
}

export interface ProdL2 {
  prodX: number;
  fLocX: number;
  tLocX: number;
  fIdx: number;
  tIdx: number;
}

export interface Journey {
  jid: string;
  date: string;
  prodX: number;
  status: string;
  isRchbl: boolean;
  stopL: CommonStop[];
  sDaysL: SDaysL[];
  polyG: PolyG;
  msgL: MsgL[];
  subscr: string;
  prodL: ProdL2[];
  dTrnCmpSX?: TrnCmpSX;
}

export interface JourneyDetailsResponse {
  common: Common;
  journey: Journey;
  fpB: string;
  fpE: string;
  planrtTS: string;
}

export interface JourneyDetailsRequest {
  req: {
    jid: string;
  };
  meth: 'JourneyDetails';
}
