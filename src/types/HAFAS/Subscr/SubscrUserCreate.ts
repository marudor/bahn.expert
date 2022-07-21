export interface SubscrChannelNoSoundOption {
  type: 'NO_SOUND';
  value: '1';
}

export interface SubscrChannelCustomerTypeOption {
  type: 'CUSTOMER_TYPE';
  value: string;
}

export type SubscrChannelOption =
  | SubscrChannelNoSoundOption
  | SubscrChannelCustomerTypeOption;

export interface SubscrChannel {
  channelId: string;
  address: string;
  /** IPHONE */
  type: string;
  options: SubscrChannelOption[];
  /** PUSH_IPHONE */
  name: string;
}

export interface SubscrUserCreateOptions {
  userId: string;
  channels: SubscrChannel[];
  /** de */
  language?: string;
}

export interface SubscrUserCreateRequest {
  req: SubscrUserCreateOptions;
  meth: 'SubscrUserCreate';
}

export interface SubscrUserCreateResponse {
  result: {
    resultCode: string;
  };
  userId: string;
}

export interface ParsedSubscrUserResponse {
  userId: string;
}
