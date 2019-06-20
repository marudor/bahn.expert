export interface CommonStopInfo {
  scheduledPlatform?: string;
  platform?: string;
  scheduledTime: number;
  time: number;
  delay?: number;
}

export interface ParsedCommonArrival extends CommonStopInfo {}

export interface ParsedCommonDeparture extends CommonStopInfo {}

export interface CommonProductInfo {
  name: string;
  line?: string;
  number?: string;
  type?: string;
}
