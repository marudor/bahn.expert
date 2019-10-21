import {
  Common,
  CommonArrival,
  CommonDeparture,
  CommonJny,
  CommonStop,
  LocL,
  MsgL,
  TrnCmpSX,
} from '.';

interface JnyFltr {
  value: string;
  mode: string;
  type: string;
}

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
  jnyFltrL?: JnyFltr[];
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
  cfg?: {
    rtMode: 'HYBRID';
  };
}

export interface SDays {
  sDaysR: string;
  sDaysI: string;
  sDaysB: string;
}

export interface JnyL extends CommonJny {
  stopL: CommonStop[];
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
  stopL: CommonStop[];
  ctxRecon: string;
  dTrnCmpSXmsgL: MsgL[];
  dTrnCmpSX?: TrnCmpSX;
  freq: Freq;
  msgL?: MsgL[];
}

export interface SecLJNY {
  type: 'JNY';
  icoX: number;
  dep: CommonDeparture;
  arr: CommonArrival;
  jny: Jny;
  parJnyL?: Jny[];
  resState: 'N' | 'B' | 'S';
  resRecommendation: string;
}

export interface Gis {
  dist: number;
  durS: string;
  dirGeo: number;
  ctx: string;
  gisPrvr: string;
  getDescr: boolean;
  getPoly: boolean;
}
export interface SecLWALK {
  type: 'WALK' | 'TRSF';
  icoX: number;
  dep: CommonDeparture;
  arr: CommonArrival;
  gis: Gis;
}

export type SecL = SecLJNY | SecLWALK;

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
  dep: CommonDeparture;
  arr: CommonArrival;
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
