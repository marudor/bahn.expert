import { CommonStopInfo } from './common';
import { Message } from './abfahrten';
import { OutConL, SecL } from './HAFAS/TripSearch';
import { ParsedProduct, ProdL, RemL } from './HAFAS';
import { Station } from './station';

export type Route$Stop = {
  arrival?: CommonStopInfo;
  departure?: CommonStopInfo;
  station: Station;
  auslastung?: Route$Auslastung;
  messages?: RemL[];
  additional?: boolean;
  cancelled?: boolean;
  irisMessages?: Message[];
};
export type Route$JourneySegment = Route$JourneySegmentTrain;
export enum AuslastungsValue {
  Gering = 1,
  Hoch,
  SehrHoch,
  Ausgebucht,
}
export interface Route$Auslastung {
  first?: AuslastungsValue;
  second?: AuslastungsValue;
}
export type Route$Journey = {
  cancelled?: boolean;
  changeDuration?: number;
  duration?: number;
  finalDestination: string;
  jid: string;
  product?: ProdL;
  raw?: SecL;
  segmentDestination: Station;
  segmentStart: Station;
  stops: Route$Stop[];
  train: ParsedProduct;
  auslastung?: Route$Auslastung;
  messages?: RemL[];
};
export type Route$JourneySegmentTrain = Route$Journey & {
  arrival: CommonStopInfo;
  departure: CommonStopInfo;
  wings?: Route$Journey[];
};

export type Route = {
  arrival: CommonStopInfo;
  departure: CommonStopInfo;
  isRideable: boolean;
  checksum: string;
  cid: string;
  date: number;
  duration: number;
  changes: number;
  segments: Route$JourneySegment[];
  segmentTypes: string[];
  raw?: OutConL;
};

export type RoutingResult = {
  routes: Route[];
  context: {
    earlier: string;
    later: string;
  };
};
