import type {
  CommonStopInfo,
  HafasStation,
  ParsedProduct,
  ProdL,
  RemL,
} from './HAFAS';
import type { Message } from './iris';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { SecL } from './HAFAS/TripSearch';
import type { TransportPublicDestinationPortionWorking } from '@/external/generated/risJourneys';

export interface Route$Stop {
  arrival?: CommonStopInfo;
  departure?: CommonStopInfo;
  station: MinimalStopPlace;
  auslastung?: Route$Auslastung;
  messages?: RemL[];
  additional?: boolean;
  cancelled?: boolean;
  irisMessages?: Message[];
  joinsWith?: TransportPublicDestinationPortionWorking[];
  splitsWith?: TransportPublicDestinationPortionWorking[];
}
export type Route$JourneySegment =
  | Route$JourneySegmentTrain
  | Route$JourneySegmentWalk;
/**
 * 1: Gering
 * 2: Hoch
 * 3: Sehr Hoch
 * 4: Ausgebucht
 */
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
export interface Route$Journey {
  cancelled?: boolean;
  changeDuration?: number;
  duration?: number;
  finalDestination: string;
  jid: string;
  product?: ProdL;
  raw?: SecL;
  segmentDestination: MinimalStopPlace;
  segmentStart: MinimalStopPlace;
  stops: Route$Stop[];
  train: ParsedProduct;
  auslastung?: Route$Auslastung;
  messages?: RemL[];
  tarifSet?: Route$TarifFareSet[];
}
export interface Route$JourneySegmentTrain extends Route$Journey {
  type: 'JNY';
  arrival: CommonStopInfo;
  departure: CommonStopInfo;
  wings?: Route$Journey[];
}

export interface WalkStopInfo {
  time: Date;
  delay?: number;
}

export interface Route$JourneySegmentWalk {
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

export interface Route$TarifFare {
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

export interface Route$TarifFareSet {
  fares: Route$TarifFare[];
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
  segments: Route$JourneySegment[];
  segmentTypes: string[];
  tarifSet?: Route$TarifFareSet[];
}

export interface RoutingResult {
  routes: SingleRoute[];
  context: {
    earlier: string;
    later: string;
  };
}
