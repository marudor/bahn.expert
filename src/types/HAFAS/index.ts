import type { HimSearchRequest } from '@/types/HAFAS/HimSearch';
import type { JourneyDetailsRequest } from './JourneyDetails';
import type { JourneyMatchRequest } from '@/types/HAFAS/JourneyMatch';
import type { JourneyTreeRequest } from '@/types/HAFAS/deprecated/JourneyTree';
import type { LocMatchRequest } from './LocMatch';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { SearchOnTripRequest } from '@/types/HAFAS/SearchOnTrip';
import type { StationBoardRequest } from '@/types/HAFAS/StationBoard';
import type { TripSearchRequest } from './TripSearch';

export type JourneyFilterMode = 'BIT' | 'EXC' | 'INC' | 'UNDEF';
export type JourneyFilterType =
  | 'ADM'
  | 'ATTRF'
  | 'ATTRJ'
  | 'ATTRL'
  | 'BC'
  | 'CAT'
  | 'COUCH'
  | 'CTX_RECON'
  | 'GROUP'
  | 'INFOTEXTS'
  | 'JID'
  | 'LID'
  | 'LINE'
  | 'LINEID'
  | 'META'
  | 'NAME'
  | 'NUM'
  | 'OP'
  | 'PID'
  | 'PROD'
  | 'ROUTE'
  | 'SLEEP'
  | 'STATIONS'
  | 'UIC';

export type AllowedHafasMethods =
  | 'BookingAssortment'
  | 'BookingData'
  | 'BookingValidation'
  | 'FeederBoard'
  | 'FetcherBoard'
  | 'GisRoute'
  | 'HimMatch'
  | 'HimSearch'
  | 'JourneyCourse'
  | 'JourneyDetails'
  | 'JourneyGeoPos'
  | 'JourneyGraph'
  | 'JourneyMatch'
  | 'JourneyTree'
  | 'LocDetails'
  | 'LocGeoPos'
  | 'LocGeoReach'
  | 'LocGraph'
  | 'LocMatch'
  | 'MatchMe'
  | 'OneFieldSearch'
  | 'PartialSearch'
  | 'Reconstruction'
  | 'SearchOnTrip'
  | 'ServerInfo'
  | 'StationBoard'
  | 'StationDetails'
  | 'SubscriptionCreate'
  | 'SubscriptionDelete'
  | 'SubscriptionDetails'
  | 'SubscriptionNotification'
  | 'SubscriptionSearch'
  | 'SubscriptionStatus'
  | 'SubscriptionUpdate'
  | 'SubscriptionUserCreate'
  | 'SubscriptionUserDelete'
  | 'SubscriptionUserUpdate'
  | 'SubscriptionValidate'
  | 'TripSearch';

export type HafasDirection = 'B' | 'F' | 'FB';
export type HimFilterMode = 'BIT' | 'EXC' | 'INC' | 'UNDEF';
export type HimFilterType =
  | 'ADMIN'
  | 'CAT'
  | 'CH'
  | 'COMP'
  | 'DEPT'
  | 'EID'
  | 'HIMCAT'
  | 'HIMID'
  | 'LINE'
  | 'OPR'
  | 'PID'
  | 'PROD'
  | 'REG'
  | 'TRAIN';
export interface HimFilter {
  mode: HimFilterMode;
  type: HimFilterType;
  value: string;
}
export interface JourneyFilter {
  mode: JourneyFilterMode;
  type: JourneyFilterType;
  value: string;
}

export type LocationFilterMode = 'BIT' | 'EXC' | 'INC';
export type LocationFilterType =
  | 'ATTRL'
  | 'ATTRP'
  | 'META'
  | 'NGR'
  | 'PLATF'
  | 'PROD'
  | 'ROUP_A'
  | 'ROUP_N'
  | 'ROUP_S'
  | 'ROUP_V'
  | 'ROUP_Z'
  | 'ROUS_A'
  | 'ROUS_N'
  | 'ROUS_S'
  | 'ROUS_V'
  | 'ROUS_Z'
  | 'ROU_A'
  | 'ROU_N'
  | 'ROU_S'
  | 'ROU_Z'
  | 'SLCTP_A'
  | 'SLCTP_N'
  | 'SLCTP_V'
  | 'SLCTP_Z'
  | 'SLCTS_A'
  | 'SLCTS_N'
  | 'SLCTS_S'
  | 'SLCTS_V'
  | 'SLCTS_Z'
  | 'SLCT_A'
  | 'SLCT_N'
  | 'SLCT_S'
  | 'SLCT_V'
  | 'SLCVT_Z';

export type LocationNGrammFilterMode =
  | 'DIST_ATTR'
  | 'DIST_INFO'
  | 'DIST_PERI'
  | 'DIST_RNG'
  | 'DIST_STNR'
  | 'EXCL_ATTR'
  | 'EXCL_INFO'
  | 'EXCL_META'
  | 'EXCL_PERI'
  | 'EXCL_RNG'
  | 'EXCL_STNR'
  | 'ONLY_META'
  | 'SLCT_ATTR'
  | 'SLCT_INFO'
  | 'SLCT_PERI'
  | 'SLCT_PROD'
  | 'SLCT_RNG'
  | 'SLCT_STNR';
export interface LocationNGrammFilter {
  attr?: string;
  crd?: Crd;
  endIds?: string;
  fTxt?: string;
  maxDist?: number;
  startIds?: string;
  type: LocationNGrammFilterMode;
}
export interface LocationFilter {
  mode: LocationFilterMode;
  ngramm: LocationNGrammFilter;
  type: LocationFilterType;
  value: string;
}

export interface CommonProductInfo {
  name: string;
  line?: string;
  number?: string;
  /**
   * This is actually category
   */
  type?: string;
  operator?: OpL;
  admin?: string;
}
export interface CommonStopInfo {
  /**
   * Quelle dieser info ist die Planwagenreihung
   */
  isPlan?: boolean;
  /**
   * Scheduled Platform
   */
  scheduledPlatform?: string;
  /**
   * Best known platform, might be identical to scheduledPlatform
   */
  platform?: string;
  /**
   * scheduled time for this stop
   */
  scheduledTime: Date;
  /**
   * best known time for this stop, might be identical to scheduledTime
   */
  time: Date;
  /**
   * @isInt
   */
  delay?: number;
  reihung?: boolean;
  messages?: RemL[];
  cancelled?: boolean;
  isRealTime?: boolean;
}

export interface RemL {
  type: string;
  code: string;
  icoX: number;
  txtN: string;
  txtS?: string;
  prio?: number;
  sIdx?: number;
}

export interface SDaysL {
  sDaysR: string;
  sDaysI: string;
  sDaysB: string;
  fLocX: number;
  tLocX: number;
}

export interface HafasCoordinates {
  lat: number;
  lng: number;
}

export interface HafasStation extends MinimalStopPlace {
  products?: ParsedProduct[];
  coordinates: HafasCoordinates;
}

export enum AllowedHafasProfile {
  DB = 'db',
  OEBB = 'oebb',
  BVG = 'bvg',
  HVV = 'hvv',
  RMV = 'rmv',
  SNCB = 'sncb',
  AVV = 'avv',
  'NAH.SH' = 'nahsh',
  INSA = 'insa',
  aNachB = 'anachb',
  VAO = 'vao',
  SBB = 'sbb',
  DBNetz = 'dbnetz',
  PKP = 'pkp',
  DBRegio = 'dbregio',
  DBSmartRBL = 'smartrbl',
  VBN = 'vbn',
  // all = 'all',
}

export interface GenericHafasRequest<out Meth extends string, out Req = any> {
  meth: Meth;
  req: Req;
}
export type HafasRequest = SingleHafasRequest[];
export type SingleHafasRequest =
  // | JourneyCourseRequest
  // | JourneyGraphRequest
  | JourneyTreeRequest
  | StationBoardRequest
  | HimSearchRequest
  | JourneyMatchRequest
  | LocMatchRequest
  | JourneyDetailsRequest
  | SearchOnTripRequest
  | TripSearchRequest;

interface CInfo {
  code: string;
  url: string;
  msg: string;
}

interface SvcResL<Res> {
  meth: string;
  err: string;
  res: Res;
}

export interface GenericRes {
  common: Common;
}

export interface HafasResponse<Res> {
  ver: string;
  lang: string;
  id: string;
  err: string;
  cInfo: CInfo;
  svcResL: SvcResL<Res>[];
}

export interface ProdCtx {
  name: string;
  num?: string;
  matchId?: string;
  catOut?: string;
  catOutS?: string;
  catOutL?: string;
  catIn?: string;
  catCode?: string;
  admin?: string;
  lineId?: string;
  line?: string;
  cls: number;
  icoX: number;
}

export interface ProdL {
  name: string;
  number?: string;
  icoX: number;
  cls: number;
  oprX?: number;
  prodCtx?: ProdCtx;
  addName?: string;
  nameS?: string;
  matchId?: string;
}

export interface LayerL {
  id: string;
  name: string;
  index: number;
  annoCnt: number;
}

export interface CrdSysL {
  id: string;
  index: number;
  type: string;
}

export interface IcoL {
  res: string;
  txt?: string;
}

export interface Crd {
  x: number;
  y: number;
  z?: number;
  layerX?: number;
  crdSysX?: number;
}

export interface PolyG {
  polyXL: number[];
  layerX: number;
  crdSysX: number;
}

export interface Journey {
  jid: string;
  date: string;
  prodX: number;
  status?: string;
  isRchbl?: boolean;
  stopL: CommonStop[];
  sDaysL: SDaysL[];
  polyG?: PolyG;
  msgL?: MsgL[];
  subscr?: string;
  prodL?: ProdL[];
  dTrnCmpSX?: TrnCmpSX;
}
export interface OptionalLocL {
  lid?: string;
  type?: string;
  name?: string;
  icoX?: number;
  extId?: string;
  state?: string;
  crd?: Crd;
  pCls?: number;
  /**
   * Reference to prodL
   */
  pRefL?: number[];
}

export type LocL = Required<OptionalLocL>;

export interface PpLocRefL {
  ppIdx: number;
  locX: number;
}

export interface PolyL {
  delta: boolean;
  dim: number;
  crdEncYX: string;
  crdEncS: string;
  crdEncF: string;
  ppLocRefL: PpLocRefL[];
}

export interface OpL {
  name: string;
  icoX: number;
}

export interface TcocL {
  c: string;
  r?: number;
}

export interface HimMsgEdgeL {
  icoCrd: {
    x: string;
    y: string;
  };
}

export interface Common {
  locL: LocL[];
  prodL: ProdL[];
  polyL: PolyL[];
  layerL: LayerL[];
  crdSysL: CrdSysL[];
  opL: OpL[];
  remL: RemL[];
  icoL: IcoL[];
  tcocL?: TcocL[];
  himMsgEdgeL?: HimMsgEdgeL[];
}

export interface CommonJny {
  jid: string;
  prodX: number;
  dirTxt: string;
  status: string;
  isRchbl: boolean;
  isCncl?: boolean;
  isPartCncl?: boolean;
  subscr: string;
  stopL?: CommonStop[];
  msgL?: MsgL[];
}

export interface CommonArrival {
  locX: number;
  idx?: number;
  aCncl?: boolean;
  aProdX?: number;
  aOutR: boolean;
  aTimeS: string;
  aTimeR?: string;
  aPlatfS?: string;
  aPlatfR?: string;
  aProgType?: string;
  type?: string;
  aTZOffset?: number;
  aTrnCmpSX?: TrnCmpSX;
  msgL?: MsgL[];
}

export interface CommonDeparture {
  locX: number;
  idx?: number;
  dCncl?: boolean;
  dProdX?: number;
  dInS: boolean;
  dInR: boolean;
  dTimeS: string;
  dTimeR?: string;
  dPlatfS?: string;
  dPlatfR?: string;
  dProgType?: string;
  type?: string;
  dTZOffset?: number;
  dTrnCmpSX?: TrnCmpSX;
  msgL?: MsgL[];
}

export interface CommonStop extends CommonArrival, CommonDeparture {
  isAdd?: boolean;
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

export interface TrnCmpSX {
  tcocX?: number[];
  tcM?: number;
}

// ParsedStuff
interface _ParsedCommon {
  locL: HafasStation[];
  prodL: ParsedProduct[];
  polyL?: ParsedPolyline[];
}
export type ParsedCommon = _ParsedCommon &
  Omit<Common, 'locL' | 'prodL' | 'polyL'>;

export type ParsedProduct = CommonProductInfo;

export interface ParsedPolyline {
  // Actually [number, number][]
  points: number[][];
  delta: boolean;
  locations: HafasStation[];
}

export type InOutMode = 'B' | 'I' | 'N' | 'O';

export interface GeoRect {
  llCrd: Crd;
  urCrd: Crd;
}

export interface GeoRing {
  cCrd: Crd;
  maxDist: number;
  minDist?: number;
}
