import type { JourneyFilter, OptionalLocL } from 'types/HAFAS';
import type { SubscrChannel } from 'types/HAFAS/Subscr/SubscrUserCreate';

export interface SubscrServiceDays {
  endDate: string;
  beginDate: string;
  /**
   * 1 or 0 for each day, starts at monday
   * example: 1001001
   * Monday, Thursday, Sunday selected
   */
  selectedWeekdays: string;
}
export interface SubscrInterval {
  jnyFltrL?: JourneyFilter[];
  period: number;
  /** HHmmSS */
  time: string;
  depLoc: OptionalLocL;
  arrLoc: OptionalLocL;
  /** ["FTF"] rest unknown */
  monitorFlags: string[];
  serviceDays: SubscrServiceDays;
}

export interface SubscrCreateOptions {
  userId: string;
  channels: Pick<SubscrChannel, 'channelId'>[];
  intvlSubscr: SubscrInterval;
}

export interface SubscrCreateRequest {
  req: SubscrCreateOptions;
  meth: 'SubscrCreate';
}

export interface SubscrCreateResponse {
  result: {
    resultCode: string;
  };
  subscrId: number;
}

export interface ParsedSubscrCreateResponse {
  subscriptionId: number;
}
