import type {
  Common,
  CommonArrival,
  CommonDeparture,
  CommonJny,
  CommonStop,
  GenericHafasRequest,
  JourneyFilter,
  MsgL,
  OptionalLocL,
  TrnCmpSX,
} from '.';
import type { CommonRoutingOptions } from '@/types/common';
import type { JnyCl, LoyalityCard, TravelerType } from '@/types/HAFAS/Tarif';

export interface TripSearchTraveler {
  type: TravelerType;
  /**
   * Testing Comment
   */
  loyalityCard?: LoyalityCard;
}

export interface TripSearchTarifRequest {
  class: JnyCl;
  traveler: TripSearchTraveler[];
}

interface BaseTripSearchOptions
  extends SharedTripSearchOptions,
    CommonRoutingOptions {
  transferTime?: number;
  maxChanges?: number;
  searchForDeparture?: boolean;
  onlyRegional?: boolean;
  // Experimental filter to only use stuff that Netzcard allows. Use at own risk!
  onlyNetzcard?: boolean;
  tarif?: TripSearchTarifRequest;
}

interface TripSearchVia {
  evaId: string;
  minChangeTime?: number;
}

export interface TripSearchOptionsV2 extends BaseTripSearchOptions {
  via?: TripSearchVia[];
}

export interface TripSearchOptionsV3 extends BaseTripSearchOptions {
  via?: TripSearchVia[];
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
  redtnCard?: number;
}

export interface TarifRequest {
  jnyCl: JnyCl;
  cType: 'PK';
  tvlrProf: TravelerProfile[];
}

interface GenericTripSearchRequest extends SharedTripSearchOptions {
  arrLocL: OptionalLocL[];
  depLocL: OptionalLocL[];
  viaLocL: {
    loc: OptionalLocL;
    min?: number;
  }[];
  antiViaLocL?: {
    loc: OptionalLocL;
  }[];
  getPT: boolean;
  maxChg: number;
  minChgTime: number;
  outFrwd: boolean;
  jnyFltrL?: JourneyFilter[];
  trfReq?: TarifRequest;

  baim?: boolean;
  ctxScr?: string;
  getConGroups?: boolean;
  numB?: number;
  outReconL?: any[];
  retDate?: string;
  retReconL?: any[];
  retTime?: string;
  extChgTime?: number;
  getAltCoordinates?: boolean;
  getAnnotations?: boolean;
  getEco?: boolean;
  getEcoCmp?: boolean;
  getIST?: boolean;
  liveSearch?: boolean;
  prefLocL?: {
    loc: OptionalLocL;
  }[];
  pt?: string;
}
interface DateTimeTripSeachRequest extends GenericTripSearchRequest {
  outDate: string;
  outTime: string;
}
interface AfterBeforeTripSearchRequest extends GenericTripSearchRequest {
  ctxScr: string;
}
export interface TripSearchRequest
  extends GenericHafasRequest<
    'TripSearch',
    DateTimeTripSeachRequest | AfterBeforeTripSearchRequest
  > {
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
  statusCode: 'OK' | Omit<string, 'OK'>;
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
