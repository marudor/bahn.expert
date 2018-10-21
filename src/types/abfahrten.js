// @flow
export type Station = {
  title: string,
  id: string | number,
  favendoId?: number,
  ds100?: string,
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
  currentStation: string,
  delayArrival?: number,
  delayDeparture?: number,
  destination: string,
  id: string,
  isCancelled: 0 | 1,
  longDistance: boolean,
  messages: Messages,
  platform: string,
  route: Train[],
  scheduledArrival?: string,
  scheduledDeparture?: string,
  scheduledPlatform: string,
  train: string,
  trainNumber: string,
  trainId: string,
  trainType: string,
  via: string[],
};

export default {};
