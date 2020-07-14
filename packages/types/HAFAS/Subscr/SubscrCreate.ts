import { JourneyFilter, LocL } from 'types/HAFAS';
import { SubscrChannel } from 'types/HAFAS/Subscr/SubscrUserCreate';

export interface SubscrCreateOptions {
  userId: string;
  channels: Pick<SubscrChannel, 'channelId'>[];
  intvlSubscr: {
    period: number;
    jnyFltrL?: JourneyFilter[];
    /** HHmmSS */
    time: string;
    depLoc: Partial<LocL>;
    arrLoc: Partial<LocL>;
    /** ["FTF"] rest unknown */
    monitorFlags: string[];
    serviceDays: {
      endDate: string;
      beginDate: string;
      /**
       * 1 or 0 for each day, starts at monday
       * example: 1001001
       * Monday, Thursday, Sunday selected
       */
      selectedWeekdays: string;
    };
  };
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
