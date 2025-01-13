import type { MinimalStopPlace } from '@/types/stopPlace';

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
	// was TRANSPORT_TYPE ENUM before
	transportType: string;
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
	messages?: RemL[];
	cancelled?: boolean;
	additional?: boolean;
	noPassengerChange?: boolean;
	/**
	 * Arrival/Departure ID
	 */
	id?: string;
	/** REPORTED Time */
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
	// Not a real hafas profile, used in routing for bahn.de stuff
	BAHN = 'bahn',
	// all = 'all',
}

export interface OpL {
	name: string;
}

export type ParsedProduct = CommonProductInfo;

export interface ParsedPolyline {
	// Actually [number, number][]
	points: number[][];
	delta?: boolean;
	locations: HafasStation[];
}
