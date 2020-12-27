type PossibleShort = '3R' | '3' | '4' | '2' | '1' | 'T' | '3V' | 'M';

export interface PlannedSequence {
  rawType: string;
  shortType?: PossibleShort;
  type: string;
}

export interface PlannedSequenceMeta {
  deprecated: boolean;
  source: string;
  train: {
    [number: string]: PlannedSequence;
  };
  valid: string;
}
