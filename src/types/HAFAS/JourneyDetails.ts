import type {
  Common,
  CommonStopInfo,
  GenericHafasRequest,
  Journey,
  OptionalLocL,
  ParsedPolyline,
  ParsedProduct,
  RemL,
} from '.';
import type { EvaNumber } from '@/types/common';
import type { RouteAuslastung, RouteStop } from '@/types/routing';

// Additional Information we can only get from HAFAS in case of RIS Details. (Occupancy & correct operator names)
export interface AdditionalJourneyInformation {
  jid?: string;
  operatorName?: string;
  occupancy: Record<EvaNumber, RouteAuslastung>;
  polyline?: ParsedPolyline;
}

export interface JourneyDetailsResponse {
  common: Common;
  journey: Journey;
  fpB: string;
  fpE: string;
  planrtTS: string;
}

interface JourneyDetailsRequestReq {
  jid: string;
  getAltCoordinates?: boolean;
  getAnnotations?: boolean;
  getPasslist?: boolean;
  getPolyline?: boolean;
  getSimpleTrainComposition?: boolean;
  getTrainComposition?: boolean;

  aDate?: string;
  aIdx?: number;
  aLoc?: OptionalLocL;
  aTime?: string;
  dDate?: string;
  dIdx?: number;
  dLoc?: OptionalLocL;
  dTime?: string;
  date?: string;
  name?: string;
  polySplitting?: boolean;
}
export interface JourneyDetailsRequest
  extends GenericHafasRequest<'JourneyDetails', JourneyDetailsRequestReq> {}

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
