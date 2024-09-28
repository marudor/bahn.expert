import type {
	CodeShare,
	TransportDestinationPortionWorkingRef,
	TransportDestinationRef,
	TransportWithDirection,
} from '@/external/generated/risJourneysV2';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type {
	CommonStopInfo,
	HafasStation,
	ParsedProduct,
	ProdL,
	RemL,
} from './HAFAS';
import type { SecL } from './HAFAS/TripSearch';
import type { Message } from './iris';

export interface RouteStop {
	arrival?: CommonStopInfo;
	departure?: CommonStopInfo;
	station: MinimalStopPlace;
	auslastung?: RouteAuslastung;
	messages?: RemL[];
	additional?: boolean;
	cancelled?: boolean;
	irisMessages?: Message[];
	joinsWith?: TransportDestinationPortionWorkingRef[];
	splitsWith?: TransportDestinationPortionWorkingRef[];
	replacedBy?: TransportDestinationRef[];
	replacementFor?: TransportDestinationRef[];
	codeShares?: CodeShare[];
	// if we change transports (Linien/Gattungswechsel)
	newTransport?: TransportWithDirection;
}
export type RouteJourneySegment =
	| RouteJourneySegmentTrain
	| RouteJourneySegmentWalk;
/**
 * 1: Gering
 * 2: Hoch
 * 3: Sehr Hoch
 * 4: Ausgebucht
 */
export enum AuslastungsValue {
	Gering = 1,
	Hoch = 2,
	SehrHoch = 3,
	Ausgebucht = 4,
}
export interface RouteAuslastung {
	first?: AuslastungsValue;
	second?: AuslastungsValue;
}
export interface RouteAuslastungWithSource {
	source?: 'HAFAS' | 'VRR' | 'Transports';
	occupancy: RouteAuslastung;
}
export interface RouteJourney {
	cancelled?: boolean;
	changeDuration?: number;
	duration?: number;
	finalDestination: string;
	// HAFAS JourneyID
	jid?: string;
	// RIS JourneyID
	journeyId?: string;
	product?: ProdL;
	raw?: SecL;
	segmentDestination: MinimalStopPlace;
	segmentStart: MinimalStopPlace;
	stops: RouteStop[];
	train: ParsedProduct;
	auslastung?: RouteAuslastung;
	messages?: RemL[];
	tarifSet?: RouteTarifFareSet[];
}
export interface RouteJourneySegmentTrain extends RouteJourney {
	type: 'JNY';
	arrival: CommonStopInfo;
	departure: CommonStopInfo;
	wings?: RouteJourney[];
}

export interface WalkStopInfo {
	time: Date;
	delay?: number;
}

export interface RouteJourneySegmentWalk {
	type: 'WALK';
	train: ParsedProduct;
	arrival: WalkStopInfo;
	departure: WalkStopInfo;
	/**
	 * @isInt
	 */
	duration: number;
	segmentStart: HafasStation;
	segmentDestination: HafasStation;
}

export interface RouteTarifFare {
	/**
	 * @isInt in Cent
	 */
	price: number;
	moreExpensiveAvailable: boolean;
	bookable: boolean;
	/** ??? */
	upsell: boolean;
	/** ??? */
	targetContext: string;
}

export interface RouteTarifFareSet {
	fares: RouteTarifFare[];
}

export interface SingleRoute {
	arrival: CommonStopInfo;
	departure: CommonStopInfo;
	isRideable: boolean;
	checksum: string;
	cid: string;
	date: Date;
	/**
	 * @isInt in ms
	 */
	duration: number;
	/**
	 * @isInt
	 */
	changes: number;
	segments: RouteJourneySegment[];
	segmentTypes: string[];
	tarifSet?: RouteTarifFareSet[];
}

export interface RoutingResult {
	routes: SingleRoute[];
	context: {
		earlier: string;
		later: string;
	};
}
