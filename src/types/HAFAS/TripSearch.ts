import {
  Common,
  CommonArrival,
  CommonDeparture,
  CommonJny,
  CommonStop,
  JourneyFilter,
  LocL,
  MsgL,
  TrnCmpSX,
} from '.';
import { DBLoyalityCard, JnyCl, TravelerType } from 'types/HAFAS/Tarif';

export interface TripSearchTraveler {
  type: TravelerType;
  loyalityCard?: DBLoyalityCard;
}

export interface TripSearchTarifRequest {
  class: JnyCl;
  traveler: TripSearchTraveler[];
}

export interface TripSearchOptions extends SharedTripSearchOptions {
  start: string;
  destination: string;
  /**
   * Max 2 via possible
   */
  via?: string[];
  time?: number;
  transferTime?: number;
  maxChanges?: number;
  searchForDeparture?: boolean;
  onlyRegional?: boolean;
  tarif?: TripSearchTarifRequest;
}

interface SharedTripSearchOptions {
  /**
   * true = not only fastest route
   */
  economic?: boolean;
  /**
   * Unknown flag
   */
  getIV?: boolean;
  /**
   * Get Stop inbetween
   */
  getPasslist?: boolean;
  /**
   * Polylines - unknown format
   */
  getPolyline?: boolean;
  numF?: number;
  ctxScr?: string;
  /**
   * Is a station nearby enough for routing?
   */
  ushrp?: boolean;
}

export interface TravelerProfile {
  type: TravelerType;
  redtnCard?: DBLoyalityCard;
}

export interface TarifRequest {
  jnyCl: JnyCl;
  cType: 'PK';
  tvlrProf: TravelerProfile;
}

interface GenericTripSearchRequest extends SharedTripSearchOptions {
  arrLocL: Partial<LocL>[];
  depLocL: Partial<LocL>[];
  viaLocL: {
    loc: Partial<LocL>;
  }[];
  getPT: boolean;
  maxChg: number;
  minChgTime: number;
  outFrwd: boolean;
  jnyFltrL?: JourneyFilter[];
  trfReq?: TarifRequest;
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
  stopL?: CommonStop[];
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

export interface SecLKISS {
  type: 'KISS';
}

export type SecL = SecLJNY | SecLWALK | SecLKISS;

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

export interface TarifFare {
  /**
   * In Cent
   */
  prc: number;
  /**
   * Does a more expensive Tarif exist?
   */
  isFromPrice: boolean;
  /**
   * Can you you still buy this?
   */
  isBookable: boolean;
  /**
   * ???
   */
  isUpsell: boolean;
  /**
   * ???
   */
  targetCtx: string;
  buttonText: string;
}
export interface TarifFareSet {
  fareL: TarifFare[];
}
export interface HafasTarifResponse {
  statusCode: 'OK' | string;
  fareSetL: TarifFareSet[];
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
  trfRes?: HafasTarifResponse;
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
