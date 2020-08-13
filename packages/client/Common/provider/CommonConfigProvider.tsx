import { CommonConfig } from 'client/Common/config';
import { ReactNode, useCallback, useState } from 'react';
import { useStorage } from 'client/useStorage';
import constate from 'constate';

const useCommonConfigInternal = ({
  initialConfig,
}: {
  initialConfig: CommonConfig;
}) => {
  const [config, setConfig] = useState(initialConfig);
  const storage = useStorage();
  const setCommonConfigKey = useCallback(
    <K extends keyof CommonConfig>(key: K, value: CommonConfig[K]) => {
      storage.set(key, value);
      setConfig((oldConfig) => ({ ...oldConfig, [key]: value }));
    },
    [storage]
  );

  return {
    config,
    setCommonConfigKey,
  };
};

interface Props {
  children: ReactNode;
}

const migrateOldConfig = (storage: ReturnType<typeof useStorage>) => {
  const oldConfig = storage.get<CommonConfig>('commonConfig');
  if (oldConfig) {
    for (const [key, value] of Object.entries(oldConfig)) {
      storage.set(key, value);
    }
    storage.remove('commonConfig');
  }
};

export const [
  InnerCommonConfigProvider,
  useCommonConfig,
  useSetCommonConfig,
] = constate(
  useCommonConfigInternal,
  (v) => v.config,
  (v) => v.setCommonConfigKey
);

export const CommonConfigProvider = ({ children }: Props) => {
  const storage = useStorage();
  migrateOldConfig(storage);

  const savedConfig: CommonConfig = {
    time: storage.get('time') ?? true,
    zoomReihung: storage.get('zoomReihung') ?? true,
    showUIC: storage.get('showUIC') ?? false,
    fahrzeugGruppe: storage.get('fahrzeugGruppe') ?? false,
    ...global.configOverride.common,
  };

  return (
    <InnerCommonConfigProvider initialConfig={savedConfig}>
      {children}
    </InnerCommonConfigProvider>
  );
};
