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

export interface RouteStop {
  arrival?: CommonStopInfo;
  departure?: CommonStopInfo;
  station: MinimalStopPlace;
  auslastung?: RouteAuslastung;
  messages?: RemL[];
  additional?: boolean;
  cancelled?: boolean;
  irisMessages?: Message[];
  joinsWith?: TransportPublicDestinationPortionWorking[];
  splitsWith?: TransportPublicDestinationPortionWorking[];
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
  Hoch,
  SehrHoch,
  Ausgebucht,
}
export interface RouteAuslastung {
  first?: AuslastungsValue;
  second?: AuslastungsValue;
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
