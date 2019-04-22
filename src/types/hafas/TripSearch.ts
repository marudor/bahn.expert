import { Common, LocL } from '.';

export interface TripSearchRequest {
  req: {
    arrLocL: Partial<LocL>[];
    depLocL: Partial<LocL>[];
    economic: boolean;
    getIV: boolean;
    getPT: boolean;
    getPasslist: boolean;
    getPolyline: boolean;
    getTariff: boolean;
    maxChg: number;
    minChgTime: number;
    numF: number;
    outDate: string;
    outFrwd: boolean;
    outTime: string;
    ushrp: boolean;
  };
  meth: 'TripSearch';
  cfg: {
    rtMode: 'HYBRID';
  };
}

export interface SDays {
  sDaysR: string;
  sDaysI: string;
  sDaysB: string;
}

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
  fIdx: number;
  tIdx: number;
  tagL: string[];
}

export interface Dep {
  locX: number;
  idx: number;
  dProdX: number;
  dPlatfS: string;
  dInR: boolean;
  dTimeS: string;
  dTimeR: string;
  dProgType: string;
  dTZOffset: number;
  type: string;
  dTrnCmpSX: DTrnCmpSX;
  msgL: MsgL[];
}

export interface Arr {
  locX: number;
  idx: number;
  aPlatfS: string;
  aOutR: boolean;
  aTimeS: string;
  aTimeR: string;
  aProgType: string;
  aTZOffset: number;
  type: string;
  aProdX?: number;
}

export interface ATrnCmpSX {
  tcM: number;
}

export interface StopL {
  locX: number;
  idx: number;
  dProdX: number;
  dPlatfS: string;
  dPlatfR?: string;
  dInR: boolean;
  dTimeS: string;
  dTimeR?: string;
  dProgType: string;
  dDirTxt: string;
  dTZOffset: number;
  type: string;
  aProdX?: number;
  aPlatfS: string;
  aPlatfR?: string;
  aOutR?: boolean;
  aTimeS: string;
  aTimeR?: string;
  aProgType: string;
  aTZOffset?: number;
  dTrnCmpSX: DTrnCmpSX;
  msgL: MsgL[];
}

export interface JnyL {
  jid: string;
  prodX: number;
  stopL: StopL[];
}

export interface Freq {
  minC: number;
  maxC: number;
  numC: number;
  jnyL: JnyL[];
}

export interface Jny {
  jid: string;
  prodX: number;
  dirTxt: string;
  chgDurR?: number;
  status: string;
  isRchbl: boolean;
  stopL: StopL[];
  ctxRecon: string;
  msgL: MsgL[];
  subscr: string;
  dTrnCmpSX: DTrnCmpSX;
  freq: Freq;
}

export interface SecL {
  type: 'JNY';
  icoX: number;
  dep: Dep;
  arr: Arr;
  jny: Jny;
  resState: string;
  resRecommendation: string;
}

export interface SotCtxt {
  cnLocX: number;
  calcDate: string;
  jid: string;
  locMode: string;
  pLocX: number;
  reqMode: string;
  sectX: number;
  calcTime: string;
}

export interface OutConL {
  cid: string;
  date: string;
  dur: string;
  chg: number;
  sDays: SDays;
  dep: Dep;
  arr: Arr;
  secL: SecL[];
  ctxRecon: string;
  conSubscr: string;
  resState: string;
  resRecommendation: string;
  recState: string;
  sotRating: number;
  isSotCon: boolean;
  showARSLink: boolean;
  sotCtxt: SotCtxt;
  cksum: string;
  cksumDti: string;
  msgL: MsgL[];
  dTrnCmpSX: DTrnCmpSX;
  freq: Freq;
  isAlt?: boolean;
}

export interface ConScoreL {
  score: number;
  conRefL: number[];
}

export interface ConScoringL {
  type: string;
  conScoreL: ConScoreL[];
}

export interface OutConGrpL {
  name: string;
  icoX: number;
  grpid: string;
  conScoringL: ConScoringL[];
  initScoringType: string;
}

export interface TripSearchResponse {
  common: Common;
  outConL: OutConL[];
  outCtxScrB: string;
  outCtxScrF: string;
  fpB: string;
  fpE: string;
  bfATS: number;
  bfIOSTS: number;
  planrtTS: string;
  outConGrpL: OutConGrpL[];
}
