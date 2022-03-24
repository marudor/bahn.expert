import type { FahrzeugKategorie } from 'types/reihung';
import type { MinimalStopPlace } from 'types/stopPlace';

export interface CoachSequencePosition {
  startPercent: number;
  endPercent: number;
}

export interface CoachSequenceSector {
  name: string;
  position: CoachSequencePosition;
}

export interface CoachSequenceStop {
  stopPlace: MinimalStopPlace;
  sectors: CoachSequenceSector[];
}

export interface CoachSequenceProduct {
  number: string;
  type: string;
  line?: string;
}

export interface CoachSequenceCoachSeats {
  comfort?: string;
  disabled?: string;
  family?: string;
}

export interface CoachSequenceCoachFeatures {
  dining?: boolean;
  wheelchair?: boolean;
  bike?: boolean;
  disabled?: boolean;
  quiet?: boolean;
  info?: boolean;
  family?: boolean;
  toddler?: boolean;
  wifi?: boolean;
  comfort?: boolean;
}

export interface CoachSequenceCoach {
  /**
   * 0: Unknown; 1: erste; 2: zweite; 3: 1&2; 4: Not for passengers
   */
  class: 0 | 1 | 2 | 3 | 4;
  category: FahrzeugKategorie;
  closed?: boolean;
  /**
   * only filled for real time information
   */
  uic?: string;
  type?: string;
  /**
   * Wagenordnungsnummer
   */
  identificationNumber?: string;
  position: CoachSequencePosition;
  features: CoachSequenceCoachFeatures;
  seats?: CoachSequenceCoachSeats;
}

export const AvailableBRConstant = [
  '401' as const,
  '402' as const,
  '403' as const,
  '406' as const,
  '407' as const,
  '410.1' as const,
  '411' as const,
  '412' as const,
  '415' as const,
];
export type AvailableBR = typeof AvailableBRConstant[number];

export const AvailableIdentifierConstant = [
  '401.LDV' as const,
  '401.9' as const,
  '411.S1' as const,
  '411.S2' as const,
  '412.7' as const,
  '412.13' as const,
  '403.R' as const,
  '403.S1' as const,
  '403.S2' as const,
  '406.R' as const,
  'IC2.TWIN' as const,
  'IC2.KISS' as const,
  'MET' as const,
  'TGV' as const,
];
export type AvailableIdentifierOnly =
  typeof AvailableIdentifierConstant[number];
export type AvailableIdentifier = AvailableIdentifierOnly | AvailableBR;

export interface CoachSequenceBaureihe {
  name: string;
  baureihe?: AvailableBR;
  identifier: AvailableIdentifier;
}

export interface CoachSequenceGroup {
  coaches: CoachSequenceCoach[];
  name: string;
  originName: string;
  destinationName: string;
  trainName?: string;
  number: string;
  baureihe?: CoachSequenceBaureihe;
}

export interface CoachSequence {
  groups: CoachSequenceGroup[];
}

export interface CoachSequenceInformation {
  stop: CoachSequenceStop;
  product: CoachSequenceProduct;
  sequence: CoachSequence;

  multipleTrainNumbers?: boolean;
  multipleDestinations?: boolean;
  isRealtime: boolean;
  /**
   * true = in direction of first sector in array
   * false = in direction of last sector in array
   * undefined = we do not know
   */
  direction?: boolean;
}
