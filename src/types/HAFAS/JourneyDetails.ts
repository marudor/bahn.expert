import { Common, CommonStop, MsgL, ParsedProduct, RemL, TrnCmpSX } from '.';
import { CommonStopInfo } from 'types/common';
import { Route$Auslastung, Route$Stop } from 'types/routing';

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

interface Route$ValidArrivalStop extends Route$Stop {
  arrival: CommonStopInfo;
}

interface Route$ValidDepartureStop extends Route$Stop {
  departure: CommonStopInfo;
}

export interface ParsedJourneyDetails {
  train: ParsedProduct;
  auslastung?: Route$Auslastung;
  jid: string;
  firstStop: Route$ValidDepartureStop;
  lastStop: Route$ValidArrivalStop;
  stops: Route$Stop[];
  messages?: RemL[];
}
