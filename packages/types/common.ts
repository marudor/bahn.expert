export interface CommonRoutingOptions {
  // evaid
  start: string;
  // evaid
  destination: string;
  time?: Date;
}

/**
 * @minLength 7
 * @maxLength 7
 */
export type EvaNumber = string;
