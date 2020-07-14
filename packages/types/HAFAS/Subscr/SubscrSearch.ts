import { OptionalLocL } from 'types/HAFAS';
import { SubscrChannel } from 'types/HAFAS/Subscr/SubscrUserCreate';
import { SubscrDetailsResponse } from 'types/HAFAS/Subscr/SubscrDetails';

export interface SubscrSearchOptions {
  userId: string;
  /**
   * @default false
   */
  onlySubIds?: boolean;
}

export interface SubscrSearchRequest {
  req: SubscrSearchOptions;
  meth: 'SubscrSearch';
}

export interface SubscrSearchResponse {
  result: {
    resultCode: string;
  };
  userId: string;
  intvlSubscrL: {
    status: SubscrDetailsResponse['status'];
    channels: SubscrChannel[];
    period: number;
    /** HHmmSS */
    time: string;
    depLoc: OptionalLocL;
    arrLoc: OptionalLocL;
  }[];
}
