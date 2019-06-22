import { CommonProductInfo } from 'types/common';
import { JourneyDetailsRequest } from './JourneyDetails';
import { LocMatchRequest } from './LocMatch';
import { Omit } from 'utility-types';
import { Station } from 'types/station';
import { TripSearchRequest } from './TripSearch';

export interface HafasStation extends Omit<Station, 'favendoId' | 'DS100'> {
  products?: ParsedProduct[];
  coordinates: {
    x: number;
    y: number;
  };
}

export type HafasRequest = Array<SingleHafasRequest>;
export type SingleHafasRequest =
  | LocMatchRequest
  | JourneyDetailsRequest
  | TripSearchRequest;

type CInfo = {
  code: string;
  url: string;
  msg: string;
};

type SvcResL<Res> = {
  meth: string;
  err: string;
  res: Res;
};

export interface GenericRes {
  common: Common;
}

export type HafasResponse<Res extends GenericRes> = {
  ver: string;
  lang: string;
  id: string;
  err: string;
  cInfo: CInfo;
  svcResL: SvcResL<Res>[];
};

export type ProdCtx = {
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
};

export type ProdL = {
  name: string;
  number?: string;
  icoX: number;
  cls: number;
  oprX?: number;
  prodCtx?: ProdCtx;
  addName?: string;
  nameS: string;
};

export type LayerL = {
  id: string;
  name: string;
  index: number;
  annoCnt: number;
};

export type CrdSysL = {
  id: string;
  index: number;
  type: string;
};

export type IcoL = {
  res: string;
  txt?: string;
};

export type Crd = {
  x: number;
  y: number;
  z?: number;
  layerX: number;
  crdSysX: number;
};

export type LocL = {
  lid: string;
  type: string;
  name: string;
  icoX: number;
  extId: string;
  state: string;
  crd: Crd;
  pCls: number;
  /**
   * Reference to prodL
   */
  pRefL?: number[];
};

export type PpLocRefL = {
  ppIdx: number;
  locX: number;
};

export type PolyL = {
  delta: boolean;
  dim: number;
  crdEncYX: string;
  crdEncS: string;
  crdEncF: string;
  ppLocRefL: PpLocRefL[];
};

export type OpL = {
  name: string;
  icoX: number;
};

export type RemL = {
  type: string;
  code: string;
  icoX: number;
  txtN: string;
  txtS?: string;
  prio?: number;
  sIdx?: number;
};

export type TcocL = {
  c: string;
  r?: number;
};

export type Common = {
  locL: LocL[];
  prodL: ProdL[];
  polyL: PolyL[];
  layerL: LayerL[];
  crdSysL: CrdSysL[];
  opL: OpL[];
  remL: RemL[];
  icoL: IcoL[];
  tcocL?: TcocL[];
};

export interface CommonJny {
  jid: string;
  prodX: number;
  dirTxt: string;
  status: string;
  isRchbl: boolean;
  isCncl?: boolean;
  subscr: string;
}

export interface CommonArrival {
  locX: number;
  idx: number;
  aProdX?: number;
  aOutR: boolean;
  aTimeS: string;
  aTimeR?: string;
  aPlatfS?: string;
  aPlatfR?: string;
  aProgType?: string;
  type: string;
}

export interface CommonDeparture {
  locX: number;
  idx: number;
  dProdX?: number;
  dInR: boolean;
  dTimeS: string;
  dTimeR?: string;
  dPlatfS?: string;
  dPlatfR?: string;
  dProgType?: string;
  type: string;
}

// ParsedStuff
interface _ParsedCommon {
  locL: HafasStation[];
  prodL: ParsedProduct[];
  raw?: Common;
}
export type ParsedCommon = _ParsedCommon & Omit<Common, 'locL' | 'prodL'>;

export interface ParsedProduct extends CommonProductInfo {}
