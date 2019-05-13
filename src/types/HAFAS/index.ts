import { JourneyDetailsRequest } from './JourneyDetails';
import { LocMatchRequest } from './LocMatch';
import { TripSearchRequest } from './TripSearch';

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

export type HafasResponse<Res> = {
  ver: string;
  lang: string;
  id: string;
  err: string;
  cInfo: CInfo;
  svcResL: SvcResL<Res>[];
};

export type ProdCtx = {
  name: string;
  num: string;
  matchId: string;
  catOut: string;
  catOutS: string;
  catOutL: string;
  catIn: string;
  catCode: string;
  admin: string;
  lineId: string;
  line?: string;
};

export type ProdL = {
  name: string;
  number?: string;
  icoX: number;
  cls: number;
  oprX?: number;
  prodCtx: ProdCtx;
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
  subscr: string;
}
