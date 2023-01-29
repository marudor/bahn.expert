import type {
  Common,
  GeoRect,
  HafasDirection,
  JourneyFilter,
  OptionalLocL,
  ParsedPolyline,
} from '@/types/HAFAS';

export interface JourneyCourseRequestOptions {
  arrLoc?: OptionalLocL;
  /**
   * yyyyMMdd
   */
  date: string;
  depLoc?: OptionalLocL;
  dir?: HafasDirection;
  getEdgeAni?: boolean;
  getEdgeCourse?: boolean;
  getIST?: boolean;
  getMainAni?: boolean;
  getMainCourse?: boolean;
  getPassLoc?: boolean;
  getPolyline?: boolean;
  jid: string;
  jnyFltrL?: JourneyFilter[];
  perSize?: number;
  perStep?: number;
  /**
   * HHmm
   */
  time?: string;
}

export interface JourneyCourseRequest {
  req: JourneyCourseRequestOptions;
  meth: 'JourneyCourse';
}

export interface JourneyCourseResponse {
  common: Common;
  date: string;
  time: string;
  mainPoly: {
    polyXL: number[];
  };
  rect: GeoRect;
  layerX: number;
  crdSysX: number;
}

export interface ParsedJourneyCourseResponse {
  polylines: ParsedPolyline[];
}
