import { Common, OptionalLocL } from 'types/HAFAS';

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

export interface HimSearchRequest {
  req: {
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
  };
  meth: 'HimSearch';
}

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

export interface HimSearchResponse {
  common: Common;
  msgL: HimMessage[];
}

export interface ParsedHimSearchResponse {
  messages: HimMessage[];
}
