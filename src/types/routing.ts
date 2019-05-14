import { CommonStopInfo } from './common';
import { OutConL, SecL } from './HAFAS/TripSearch';
import { ParsedProduct, ProdL } from './HAFAS';
import { Station } from './station';

export interface Route$StopInfo extends CommonStopInfo {
  reihung: boolean;
}

export type Route$Stop = {
  arrival?: Route$StopInfo;
  departure?: Route$StopInfo;
  station: Station;
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
  isCancelled?: boolean;
  changeDuration?: number;
  duration?: number;
  finalDestination: string;
  jid: string;
  product?: ProdL;
  raw?: SecL;
  segmentDestination: Station;
  segmentStart: Station;
  stops?: Route$Stop[];
  train: ParsedProduct;
  auslastung?: Route$Auslastung;
};
export type Route$JourneySegmentTrain = Route$Journey & {
  arrival: Route$StopInfo;
  departure: Route$StopInfo;
  wings?: Route$Journey[];
};

export type Route = {
  arrival: Route$StopInfo;
  departure: Route$StopInfo;
  isRideable: boolean;
  checksum: string;
  cid: string;
  date: number;
  duration: number;
  changes: number;
  segments: Route$JourneySegment[];
  segmentTypes: Array<string>;
  raw?: OutConL;
};

export type RoutingResult = {
  routes: Route[];
  context: {
    earlier: string;
    later: string;
  };
};
