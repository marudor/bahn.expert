import { RemL } from './HAFAS';

export interface CommonStopInfo {
  scheduledPlatform?: string;
  platform?: string;
  scheduledTime: number;
  time: number;
  delay?: number;
  reihung?: boolean;
  messages?: RemL[];
}

export interface ParsedCommonArrival extends CommonStopInfo {}

export interface ParsedCommonDeparture extends CommonStopInfo {}

export interface CommonProductInfo {
  name: string;
  line?: string;
  number?: string;
  type?: string;
}
