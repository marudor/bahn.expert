import type { ChangeEvent } from 'react';
import type { StationSearchType } from 'types/station';

export interface AbfahrtenConfig {
  readonly searchType: StationSearchType;
  readonly lookahead: string;
  readonly lookbehind: string;
  readonly lineAndNumber: boolean;
  readonly autoUpdate: number;
}

export interface CommonConfig {
  readonly time: boolean;
  readonly zoomReihung: boolean;
  readonly showUIC: boolean;
  readonly fahrzeugGruppe: boolean;
}

type Sanitize<Config> = {
  [K in keyof Config]: (input: string | undefined) => Config[K];
};

export type AbfahrtenConfigSanitize = Sanitize<AbfahrtenConfig>;
export type CommonConfigSanitize = Sanitize<CommonConfig>;

export function handleConfigCheckedChange<
  K extends keyof AbfahrtenConfig | keyof CommonConfig,
  SC extends (k: K, value: any) => void
>(key: K, setConfig: SC) {
  return (e: ChangeEvent<HTMLInputElement>): void =>
    setConfig(key, e.currentTarget.checked);
}

export function handleConfigNumberSelectChange<
  K extends keyof AbfahrtenConfig | keyof CommonConfig,
  SC extends (k: K, value: any) => void
>(key: K, setConfig: SC) {
  return (e: ChangeEvent<HTMLSelectElement>): void =>
    setConfig(key, Number.parseInt(e.currentTarget.value, 10));
}
