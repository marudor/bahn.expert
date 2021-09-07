import type { ChangeEvent } from 'react';

export interface AbfahrtenConfig {
  readonly lookahead: string;
  readonly lookbehind: string;
  readonly lineAndNumber: boolean;
  readonly autoUpdate: number;
  readonly showCancelled: boolean;
}

export interface CommonConfig {
  readonly showUIC: boolean;
  readonly fahrzeugGruppe: boolean;
  readonly time: boolean;
}

type Sanitize<Config> = {
  [K in keyof Config]: (input: string | string[] | undefined) => Config[K];
};

export type AbfahrtenConfigSanitize = Sanitize<AbfahrtenConfig>;
export type CommonConfigSanitize = Sanitize<CommonConfig>;

export function handleConfigCheckedChange<
  K extends keyof AbfahrtenConfig | keyof CommonConfig,
  SC extends (k: K, value: any) => void,
>(key: K, setConfig: SC) {
  return (e: ChangeEvent<HTMLInputElement>): void =>
    setConfig(key, e.currentTarget.checked);
}

export function handleConfigNumberSelectChange<
  K extends keyof AbfahrtenConfig | keyof CommonConfig,
  SC extends (k: K, value: any) => void,
>(key: K, setConfig: SC) {
  return (e: ChangeEvent<HTMLSelectElement>): void =>
    setConfig(key, Number.parseInt(e.currentTarget.value, 10));
}
