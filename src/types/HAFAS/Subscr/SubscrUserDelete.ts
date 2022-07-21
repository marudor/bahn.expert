export interface SubscrUserDeleteOptions {
  userId: string;
}

export interface SubscrUserDeleteRequest {
  req: SubscrUserDeleteOptions;
  meth: 'SubscrUserDelete';
}

export interface SubscrUserDeleteResponse {
  result: {
    resultCode: string;
  };
  userId: string;
}
