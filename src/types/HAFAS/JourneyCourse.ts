import { HafasDirection, JourneyFilter, OptionalLocL } from 'types/HAFAS';

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

export type JourneyCourseResponse = any;
