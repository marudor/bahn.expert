import type { ChangeEvent } from 'react';

export interface CommonConfig {
  readonly showUIC: boolean;
  readonly showCoachType: boolean;
  readonly autoUpdate: number;
  readonly fahrzeugGruppe: boolean;
  readonly hideTravelynx: boolean;
  readonly delayTime: boolean;

  readonly lineAndNumber: boolean;
  readonly showCancelled: boolean;
  readonly sortByTime: boolean;
  readonly onlyDepartures: boolean;
  readonly startTime: Date | undefined;
  readonly lookahead: string;
  readonly lookbehind: string;
  readonly showRl100: boolean;
}

type Sanitize<Config> = {
  [K in keyof Config]: (input: string | string[] | undefined) => Config[K];
};

export type CommonConfigSanitize = Sanitize<CommonConfig>;

export function handleConfigCheckedChange<
  K extends keyof CommonConfig,
  SC extends (k: K, value: any) => void,
>(key: K, setConfig: SC) {
  return (e: ChangeEvent<HTMLInputElement>): void =>
    setConfig(key, e.currentTarget.checked);
}

export function handleConfigNumberSelectChange<
  K extends keyof CommonConfig,
  SC extends (k: K, value: any) => void,
>(key: K, setConfig: SC) {
  return (e: ChangeEvent<HTMLSelectElement>): void =>
    setConfig(key, Number.parseInt(e.currentTarget.value, 10));
}
