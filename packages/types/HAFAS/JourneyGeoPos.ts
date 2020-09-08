import type {
  CommonStop,
  Crd,
  GenericRes,
  GeoRect,
  GeoRing,
  InOutMode,
  JourneyFilter,
  OptionalLocL,
  ParsedProduct,
} from 'types/HAFAS';
import type { Coordinates } from 'types/station';
import type { Route$Stop } from 'types/routing';

export type JourneyGeoPosOptions = JourneyGeoPosRequestOptions;

export type JourneyTrainPosMode =
  | 'CALC'
  | 'CALC_FOR_REPORT'
  | 'CALC_ONLY'
  | 'CALC_REPORT'
  | 'REPORT_ONLY'
  | 'REPORT_ONLY_WITH_STOPS';
export interface JourneyGeoPosRequestOptions {
  ageOfReport?: boolean;
  date?: string;
  time?: string;
  getSimpleTrainComposition?: boolean;
  getUnmatched?: boolean;
  inOut?: InOutMode;
  jnyFltrL?: JourneyFilter[];
  locL?: OptionalLocL[];
  maxJny?: boolean;
  onlyRT?: boolean;
  perSize?: number;
  perStep?: number;
  rect?: GeoRect;
  ring?: GeoRing;
  rtMsgStatus?: boolean;
  trainPosMode?: JourneyTrainPosMode;
  zoom?: number;
}
export interface JourneyGeoPosRequest {
  req: JourneyGeoPosRequestOptions;
  meth: 'JourneyGeoPos';
}

export interface JourneyGeoPos {
  jid: string;
  date: string;
  prodX: number;
  dirTxt?: string;
  dirGeo: number;
  stopL: CommonStop[];
  proc: number;
  dist: number;
  pos: Crd;
  isBase: boolean;
}

export interface JourneyGeoPosResponse extends GenericRes {
  date: string;
  time: string;
  jnyL: JourneyGeoPos[];
  fpB: string;
  fpE: string;
  planrtTS: string;
}

export interface SingleParsedJourneyGeoPos {
  jid: string;
  date: number;
  train: ParsedProduct;
  position: Coordinates;
  stops: Route$Stop[];
}

export type ParsedJourneyGeoPosResponse = SingleParsedJourneyGeoPos[];
