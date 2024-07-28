import type { Common, GenericHafasRequest } from '.';

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

interface LocMatchRequestReq {
	input: {
		loc: {
			name: string;
			type: 'S' | 'ALL';
		};
		field: 'S';
	};
}

export interface LocMatchRequest
	extends GenericHafasRequest<'LocMatch', LocMatchRequestReq> {}
