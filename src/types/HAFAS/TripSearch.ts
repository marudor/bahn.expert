import { Common, CommonArrival, CommonDeparture, CommonJny, LocL } from '.';

interface GenericTripSearchRequest {
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
  outFrwd: boolean;
  ushrp: boolean;
  ctxScr?: string;
}
interface DateTimeTripSeachRequest extends GenericTripSearchRequest {
  outDate: string;
  outTime: string;
}
interface AfterBeforeTripSearchRequest extends GenericTripSearchRequest {
  ctxScr: string;
}
export interface TripSearchRequest {
  req: DateTimeTripSeachRequest | AfterBeforeTripSearchRequest;
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

export interface TrnCmpSX {
  tcocX?: number[];
  tcM?: number;
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

export interface Dep extends CommonDeparture {
  dTZOffset: number;
  dTrnCmpSX?: TrnCmpSX;
  msgL: MsgL[];
}

export interface Arr extends CommonArrival {
  aTZOffset: number;
  aTrnCmpSX?: TrnCmpSX;
}

export interface StopL extends Arr, Dep {}

export interface JnyL extends CommonJny {
  stopL: StopL[];
}

export interface Freq {
  minC: number;
  maxC: number;
  numC: number;
  jnyL: JnyL[];
}

export interface Jny extends CommonJny {
  chgDurR?: number;
  isCncl?: boolean;
  stopL: StopL[];
  ctxRecon: string;
  dTrnCmpSXmsgL: MsgL[];
  dTrnCmpSX?: TrnCmpSX;
  freq: Freq;
}

export interface SecL {
  type: 'JNY';
  icoX: number;
  dep: Dep;
  arr: Arr;
  jny: Jny;
  parJnyL?: Jny[];
  resState: 'N' | 'B' | 'S';
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
  isNotRdbl?: boolean;
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
  dTrnCmpSX: TrnCmpSX;
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
