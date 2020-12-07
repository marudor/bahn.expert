import type {
  CommonStopInfo,
  HafasStation,
  ParsedProduct,
  ProdL,
  RemL,
} from './HAFAS';
import type { Message } from './iris';
import type { OutConL, SecL } from './HAFAS/TripSearch';
import type { PlannedSequence } from 'types/planReihung';
import type { Station } from './station';

export interface Route$Stop<DateType = Date> {
  arrival?: CommonStopInfo<DateType>;
  departure?: CommonStopInfo<DateType>;
  station: Station;
  auslastung?: Route$Auslastung;
  messages?: RemL[];
  additional?: boolean;
  cancelled?: boolean;
  irisMessages?: Message[];
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
  // Hoch
  Hoch,
  SehrHoch,
  Ausgebucht,
}
export interface Route$Auslastung {
  first?: AuslastungsValue;
  second?: AuslastungsValue;
}
export interface Route$Journey<DateType = Date> {
  cancelled?: boolean;
  changeDuration?: number;
  duration?: number;
  finalDestination: string;
  jid: string;
  product?: ProdL;
  raw?: SecL;
  segmentDestination: Station;
  segmentStart: Station;
  stops: Route$Stop<DateType>[];
  train: ParsedProduct;
  auslastung?: Route$Auslastung;
  messages?: RemL[];
  tarifSet?: Route$TarifFareSet[];
  plannedSequence?: PlannedSequence;
}
export interface Route$JourneySegmentTrain<DateType = Date>
  extends Route$Journey<DateType> {
  type: 'JNY';
  arrival: CommonStopInfo<DateType>;
  departure: CommonStopInfo<DateType>;
  wings?: Route$Journey<DateType>[];
}

export type WalkStopInfo<DateType = Date> = {
  time: DateType;
  delay?: number;
};

export interface Route$JourneySegmentWalk<DateType = Date> {
  type: 'WALK';
  train: ParsedProduct;
  arrival: WalkStopInfo<DateType>;
  departure: WalkStopInfo<DateType>;
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

export interface SingleRoute<DateType = Date> {
  arrival: CommonStopInfo<DateType>;
  departure: CommonStopInfo<DateType>;
  isRideable: boolean;
  checksum: string;
  cid: string;
  date: DateType;
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
  raw?: OutConL;
}

export interface RoutingResult<DateType = Date> {
  routes: SingleRoute<DateType>[];
  context: {
    earlier: string;
    later: string;
  };
}
