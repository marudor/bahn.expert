export interface SubscrDetailsOptions {
  userId: string;
  subscrId: number;
}

export interface SubscrDetailsRequest {
  req: SubscrDetailsOptions;
  meth: 'SubscrDetails';
}

export interface SubscrDetailsResponse {}
