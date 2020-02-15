import { CommonStation, Coordinates } from 'types/station';
import { JourneyDetailsRequest } from './JourneyDetails';
import { LocGeoPosRequest } from './LocGeoPos';
import { LocMatchRequest } from './LocMatch';
import { Omit } from 'utility-types';
import { TripSearchRequest } from './TripSearch';

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

export interface CommonProductInfo {
  name: string;
  line?: string;
  number?: string;
  type?: string;
  operator?: OpL;
  admin?: string;
}
export interface CommonStopInfo {
  scheduledPlatform?: string;
  platform?: string;
  /**
   * Unix Time (ms)
   */
  scheduledTime: number;
  /**
   * Unix Time (ms)
   */
  time: number;
  /**
   * Minutes
   */
  delay?: number;
  reihung?: boolean;
  messages?: RemL[];
  cancelled?: boolean;
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

export interface HafasStation extends CommonStation {
  products?: ParsedProduct[];
  coordinates: Coordinates;
}

export enum AllowedHafasProfile {
  db = 'db',
  oebb = 'oebb',
  sncb = 'sncb',
  avv = 'avv',
  nahsh = 'nahsh',
  hvv = 'hvv',
  bvg = 'bvg',
  insa = 'insa',
  anachb = 'anachb',
  vao = 'vao',
  sbb = 'sbb',
  dbnetz = 'dbnetz',
  rmv = 'rmv',
  // all = 'all',
}
export type HafasRequest = SingleHafasRequest[];
export type SingleHafasRequest =
  | LocMatchRequest
  | JourneyDetailsRequest
  | TripSearchRequest
  | LocGeoPosRequest;

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

export interface HafasResponse<Res extends GenericRes> {
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
  subscr: string;
  stopL?: CommonStop[];
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
  raw?: Common;
}
export type ParsedCommon = _ParsedCommon &
  Omit<Common, 'locL' | 'prodL' | 'polyL'>;

export interface ParsedProduct extends CommonProductInfo {}

export interface ParsedPolyline {
  points: [number, number][];
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
