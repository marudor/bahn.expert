import type {
  Common,
  CommonStopInfo,
  Journey,
  OptionalLocL,
  ParsedProduct,
  RemL,
} from '.';
import type { Route$Auslastung, Route$Stop } from 'types/routing';

export interface JourneyDetailsResponse {
  common: Common;
  journey: Journey;
  fpB: string;
  fpE: string;
  planrtTS: string;
}

export interface JourneyDetailsRequest {
  req: {
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
  };
  meth: 'JourneyDetails';
}

export interface Route$ValidArrivalStop<DateType = Date>
  extends Route$Stop<DateType> {
  arrival: CommonStopInfo<DateType>;
}

export interface Route$ValidDepartureStop<DateType = Date>
  extends Route$Stop<DateType> {
  departure: CommonStopInfo<DateType>;
}

export interface ParsedJourneyDetails<DateType = Date> {
  train: ParsedProduct;
  auslastung?: Route$Auslastung;
  jid: string;
  firstStop: Route$ValidDepartureStop<DateType>;
  lastStop: Route$ValidArrivalStop<DateType>;
  stops: Route$Stop<DateType>[];
  messages?: RemL[];
}
