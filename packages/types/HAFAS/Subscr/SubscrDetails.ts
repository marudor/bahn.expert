import type { SubscrChannel } from 'types/HAFAS/Subscr/SubscrUserCreate';
import type { SubscrInterval } from 'types/HAFAS/Subscr/SubscrCreate';

export interface SubscrDetailsOptions {
  userId: string;
  subscrId: number;
}

export interface SubscrDetailsRequest {
  req: SubscrDetailsOptions;
  meth: 'SubscrDetails';
}

export interface SubscrRTEvent {}
export interface SubscrHIMEvent {}

export interface SubscrEventHistory {
  rtEvents: SubscrRTEvent[];
  himEvents: SubscrHIMEvent[];
}
export interface SubscrDetailsResponse {
  result: {
    resultCode: string;
  };
  userId: string;
  subscrId: number;
  status: 'ACTIVE' | 'EXPIRED';
  channels: SubscrChannel[];
  intvlSubscr: SubscrInterval;
  eventHisotry: SubscrEventHistory;
}
