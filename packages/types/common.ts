export interface CommonRoutingOptions {
  start: EvaNumber;
  destination: EvaNumber;
  time?: Date;
}

/**
 * Usually 7 digits, leading zeros can be omitted
 * @example "8000105"
 * @example "100010"
 */
export type EvaNumber = string;
