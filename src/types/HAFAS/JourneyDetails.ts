import { Common, Journey, ParsedProduct, RemL } from '.';
import { CommonStopInfo } from 'types/common';
import { Route$Auslastung, Route$Stop } from 'types/routing';

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
  };
  meth: 'JourneyDetails';
}

interface Route$ValidArrivalStop extends Route$Stop {
  arrival: CommonStopInfo;
}

interface Route$ValidDepartureStop extends Route$Stop {
  departure: CommonStopInfo;
}

export interface ParsedJourneyDetails {
  train: ParsedProduct;
  auslastung?: Route$Auslastung;
  jid: string;
  firstStop: Route$ValidDepartureStop;
  lastStop: Route$ValidArrivalStop;
  stops: Route$Stop[];
  messages?: RemL[];
}
