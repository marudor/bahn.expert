export interface CommonRoutingOptions {
  start: EvaNumber;
  destination: EvaNumber;
  time?: Date;
}

/**
 * Usually 7 digits
 */
export type EvaNumber = string;
