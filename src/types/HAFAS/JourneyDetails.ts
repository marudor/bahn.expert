import type { EvaNumber } from '@/types/common';
import type { RouteAuslastung, RouteStop } from '@/types/routing';
import type { CommonStopInfo, ParsedPolyline, ParsedProduct, RemL } from '.';

// Additional Information we can only get from HAFAS in case of RIS Details. (Occupancy & correct operator names)
export interface AdditionalJourneyInformation {
	jid?: string;
	operatorName?: string;
	occupancy: Record<EvaNumber, RouteAuslastung>;
	polyline?: ParsedPolyline;
}

export interface RouteValidArrivalStop extends RouteStop {
	arrival: CommonStopInfo;
}

export interface RouteValidDepartureStop extends RouteStop {
	departure: CommonStopInfo;
}

export interface ParsedJourneyDetails {
	train: ParsedProduct;
	auslastung?: RouteAuslastung;
	jid: string;
	firstStop: RouteValidDepartureStop;
	lastStop: RouteValidArrivalStop;
	stops: RouteStop[];
	messages?: RemL[];
	polylines?: ParsedPolyline[];
}
