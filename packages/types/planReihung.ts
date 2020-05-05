interface Wagons {
  [key: string]: boolean;
}

type PossibleShort = '3R' | '3' | '4' | '2' | '1' | 'T' | '3V';

export interface PlannedSequence {
  raw: string;
  short?: PossibleShort;
  type: string;
  wagons: Wagons;
}
