import type {
  Common,
  GenericHafasRequest,
  HafasStation,
  HimFilter,
  OptionalLocL,
  ParsedProduct,
} from '@/types/HAFAS';

export interface HimSearchRequestOptions {
  comp?: string;
  dailyB?: string;
  dailyE?: string;
  dateB?: string;
  dateE?: string;
  dept?: string;
  dirLoc?: OptionalLocL;
  himFltrL?: HimFilter[];
  maxNum?: number;
  onlyHimId?: boolean;
  onlyToday?: boolean;
  stLoc?: OptionalLocL;
  timeB?: string;
  timeE?: string;
}
export interface HimSearchRequest
  extends GenericHafasRequest<'HimSearch', HimSearchRequestOptions> {}

export interface PubChL {
  name: string;
  fDate: string;
  fTime: string;
  tDate: string;
  tTime: string;
}
export interface HimMessage {
  hid: string;
  act: boolean;
  head: string;
  lead: string;
  text: string;
  icoX: number;
  prio: number;
  fLocX: number;
  tLocX: number;
  prod: number;
  affProdRefL: number[];
  IModDate: string;
  IModTime: string;
  sDate: string;
  sTime: string;
  eDate: string;
  eTime: string;
  comp: string;
  cat: number;
  pubChL: PubChL[];
  edgeRefL: number[];
}

export interface ParsedHimMessage extends HimMessage {
  affectedProducts: ParsedProduct[];
  startTime: Date;
  endTime: Date;
  fromStopPlace?: HafasStation;
  toStopPlace?: HafasStation;
}

export interface HimSearchResponse {
  common: Common;
  msgL: HimMessage[];
}

export interface ParsedHimSearchResponse {
  messages: ParsedHimMessage[];
}
