export interface SubscrDeleteOptions {
  userId: string;
  subscrId: number;
}

export interface SubscrDeleteRequest {
  req: SubscrDeleteOptions;
  meth: 'SubscrDelete';
}

export interface SubscrDeleteResponse {
  result: {
    resultCode: string;
  };
  userId: string;
  subscrId: string;
}
