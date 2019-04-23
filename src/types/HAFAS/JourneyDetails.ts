import { Common } from '.';

export interface DTrnCmpSX {
  tcocX: number[];
}

export interface TxtC {
  r: number;
  g: number;
  b: number;
}

export interface MsgL {
  type: string;
  remX: number;
  txtC: TxtC;
  prio: number;
  tagL: string[];
}

export interface StopL {
  locX: number;
  idx: number;
  dProdX: number;
  dPlatfS: string;
  dInR: boolean;
  dTimeS: string;
  dProgType: string;
  dTZOffset: number;
  type: string;
  aProdX?: number;
  aPlatfS: string;
  aOutR?: boolean;
  aTimeS: string;
  aTZOffset?: number;
  aProgType: string;
  dTrnCmpSX: DTrnCmpSX;
  border?: boolean;
  aTimeR: string;
  dTimeR: string;
  msgL: MsgL[];
  dInS?: boolean;
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

export interface MsgL2 {
  type: string;
  remX: number;
  fLocX: number;
  tLocX: number;
  tagL: string[];
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
  stopL: StopL[];
  sDaysL: SDaysL[];
  polyG: PolyG;
  msgL: MsgL2[];
  subscr: string;
  prodL: ProdL2[];
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
