import type { Common } from '.';

export interface LocMatchResponse {
  common: Common;
  match: {
    field: string;
    state: string;
    locL: {
      lid: string;
      type: string;
      name: string;
      icoX: number;
      extId: string;
      state: string;
      crd: {
        x: number;
        y: number;
        layerX: number;
        crdSysX: number;
        z?: number;
      };
      meta: boolean;
      pCls: number;
      pRefL: number[];
      wt: number;
    }[];
  };
}

export interface LocMatchRequest {
  req: {
    input: {
      loc: {
        name: string;
        type: 'S' | 'ALL';
      };
      field: 'S';
    };
  };
  meth: 'LocMatch';
}
