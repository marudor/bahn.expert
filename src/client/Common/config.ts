import { StationSearchType } from 'types/station';

export enum CheckInType {
  None,
  Travelynx,
}

export interface MarudorConfig {
  readonly time: boolean;
  readonly searchType: StationSearchType;
  readonly checkIn: CheckInType;
  readonly zoomReihung: boolean;
  readonly showSupersededMessages: boolean;
  readonly lookahead: string;
  readonly lookbehind: string;
  readonly fahrzeugGruppe: boolean;
  readonly lineAndNumber: boolean;
  readonly autoUpdate: number;
  readonly showUIC: boolean;
}

export type MarudorConfigSanitize = {
  [K in keyof MarudorConfig]: (input: string) => MarudorConfig[K];
};
