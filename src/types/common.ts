import type { Coordinate2D } from '@/external/types';

export interface CommonRoutingOptions {
  start: EvaNumber | Coordinate2D;
  destination: EvaNumber | Coordinate2D;
  time?: Date;
}

/**
 * Usually 7 digits, leading zeros can be omitted
 * @example "8000105"
 * @example "100010"
 */
export type EvaNumber = string;
