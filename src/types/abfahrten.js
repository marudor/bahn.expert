// @flow
export type Station = {
  title: string,
  id: string | number,
};

export type Message = {
  text: string,
  timestamp: string,
};

export type Train = {
  isAdditional?: 0 | 1,
  isCancelled?: 0 | 1,
  name: string,
};

export type Messages = {
  qos: Message[],
  delay: Message[],
};
export type Abfahrt = {
  id: string,
  delayArrival?: number,
  delayDeparture?: number,
  destination: string,
  isCancelled: 0 | 1,
  messages: Messages,
  platform: string,
  route: Train[],
  scheduledArrival?: string,
  scheduledDeparture?: string,
  scheduledPlatform: string,
  train: string,
  via: string[],
};
