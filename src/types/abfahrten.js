// @flow
import type { DateTime } from 'luxon';

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
  delayArrival?: number,
  delayDeparture?: number,
  destination: string,
  id: string,
  isCancelled: 0 | 1,
  longDistance: boolean,
  messages: Messages,
  platform: string,
  route: Train[],
  scheduledArrival?: DateTime,
  scheduledDeparture?: DateTime,
  scheduledPlatform: string,
  train: string,
  trainNumber: string,
  trainId: number,
  trainType: string,
  via: string[],
};

export default {};
