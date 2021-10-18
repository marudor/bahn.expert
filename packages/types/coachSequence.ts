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

export type AvailableBR =
  | '401'
  | '402'
  | '403'
  | '406'
  | '407'
  | '410.1'
  | '411'
  | '412'
  | '415';

export type AvailableIdentifier =
  | AvailableBR
  | '401.LDV'
  | '401.9'
  | '411.S1'
  | '411.S2'
  | '412.7'
  | '412.13'
  | '403.R'
  | '403.S1'
  | '403.S2'
  | '406.R'
  | 'IC2.TWIN'
  | 'IC2.KISS'
  | 'MET'
  | 'TGV';

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
