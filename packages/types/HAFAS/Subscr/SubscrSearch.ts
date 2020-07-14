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
}
