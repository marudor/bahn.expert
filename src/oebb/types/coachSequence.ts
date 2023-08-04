export interface OEBBCoachSequenceWagon {
  uicNumber?: string;
  kind?: string;
  origin: OEBBIdentifier;
  destination: OEBBIdentifier;
  ranking: number;
  capacityBusinessClass: number;
  capacityFirstClass: number;
  capacitySecondClass: number;
  capacityCouchette: number;
  capacitySleeper: number;
  capacityWheelChair: number;
  capacityBicycle: number;
  isBicycleAllowed: boolean;
  isWheelChairAccessible: boolean;
  hasWifi: boolean;
  isInfoPoint: boolean;
  isPlayZone: boolean;
  isChildCinema: boolean;
  isDining: boolean;
  isQuietZone: boolean;
  isLocked: boolean;
  destinationName: string;
  lengthOverBuffers: number;
  originTime: string;
  destinationTime: string;
  seasoning?: {
    startDate: string;
    seasoningString: string;
  };
}

/** example: WBF (Wien Hbf) */
export type OEBBIdentifier = string;

export interface OEBBTrainInfo {
  trainNr: number;
  /** ISO Date */
  date: string;
  version: number;
  isReported: boolean;
  assemblyStation: string;
  source: string;
  stations: OEBBIdentifier[];
  wagons: OEBBCoachSequenceWagon[];
}

export interface OEBBSectorInfo {
  scheduled: string;
  reported?: string;
}

export interface OEBBPlatforms {
  /** @isInt */
  scheduled: number;
  /** @isInt */
  reported: number;
}

export interface OEBBTimeFormat {
  /** @isInt */
  days: number;
  /** @isInt */
  hours: number;
  /** @isInt */
  minutes: number;
}
export interface OEBBTime {
  scheduled: OEBBTimeFormat;
  reported?: OEBBTimeFormat;
}

export interface OEBBPortion {
  /** @isInt */
  trainNr: number;
  /** `${type} ${number}` */
  trainName: string;
}

export interface OEBBTimeTableInfo {
  date: string;
  /** @isInt */
  trainNr: number;
  trainName: string;
  stationName: string;
  platform: OEBBPlatforms;
  sectors: OEBBSectorInfo;
  time: OEBBTime;
  portions: OEBBPortion[];
}

export type OEBBAccessType = 'STIEGENAUFGANG' | 'AUFZUG' | 'ROLLTREPPE';

export interface OEBBAccess {
  platform: string;
  distance: number;
  name: string;
  type: OEBBAccessType;
}

export interface OEBBTrainOnPlatform {
  position: number;
  departureTowardsFirstSector: boolean;
}

export interface OEBBSector {
  name: string;
  length: number;
}

export interface OEBBPlatformInfo {
  /** @isInt */
  platform: number;
  length: number;
  sectors: OEBBSector[];
}

interface OEBBLoadStat {
  ranking: number;
  ratio: number;
}
interface OEBBLoad {
  stats: OEBBLoadStat[];
}
export interface OEBBInfo {
  timeTableInfo: OEBBTimeTableInfo;
  train?: OEBBTrainInfo;
  accessess: OEBBAccess[];
  trainOnPlatform?: OEBBTrainOnPlatform;
  platform?: OEBBPlatformInfo;
  load?: OEBBLoad;
}
