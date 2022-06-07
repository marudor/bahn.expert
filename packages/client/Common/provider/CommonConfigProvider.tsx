import { commonConfigSanitize } from 'client/util';
import { useCallback, useState } from 'react';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { CommonConfig } from 'client/Common/config';
import type { FC, PropsWithChildren, ReactNode } from 'react';

const useCommonConfigInternal = ({
  initialConfig,
}: PropsWithChildren<{
  initialConfig: CommonConfig;
}>) => {
  const [config, setConfig] = useState(initialConfig);
  const storage = useStorage();
  const setCommonConfigKey = useCallback(
    <K extends keyof CommonConfig>(key: K, value: CommonConfig[K]) => {
      storage.set(key, value);
      setConfig((oldConfig) => ({ ...oldConfig, [key]: value }));
    },
    [storage],
  );

  return {
    config,
    setCommonConfigKey,
  };
};

interface Props {
  children: ReactNode;
}

export const [InnerCommonConfigProvider, useCommonConfig, useSetCommonConfig] =
  constate(
    useCommonConfigInternal,
    (v) => v.config,
    (v) => v.setCommonConfigKey,
  );

export const CommonConfigProvider: FC<Props> = ({ children }) => {
  const storage = useStorage();

  const savedConfig: CommonConfig = {
    autoUpdate: commonConfigSanitize.autoUpdate(
      storage.get<string>('autoUpdate'),
    ),
    time: storage.get('time') ?? true,
    showUIC: storage.get('showUIC') ?? false,
    fahrzeugGruppe: storage.get('fahrzeugGruppe') ?? false,
    showCoachType: storage.get('showCoachType') ?? false,
    ...globalThis.configOverride.common,
  };

  return (
    <InnerCommonConfigProvider initialConfig={savedConfig}>
      {children}
    </InnerCommonConfigProvider>
  );
};
