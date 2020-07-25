import { CheckInType, CommonConfig } from 'client/Common/config';
import { createContainer } from 'unstated-next';
import { ReactNode, useCallback, useState } from 'react';
import useWebStorage from 'client/useWebStorage';

const useCommonConfig = (initialConfig: CommonConfig) => {
  const [config, setConfig] = useState(initialConfig);
  const storage = useWebStorage();
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

// @ts-expect-error, complains about missing default
const CommonConfigContainer = createContainer(useCommonConfig);

export default CommonConfigContainer;

interface Props {
  children: ReactNode;
}

const migrateOldConfig = (storage: ReturnType<typeof useWebStorage>) => {
  const oldConfig = storage.get<CommonConfig>('commonConfig');
  if (oldConfig) {
    for (const [key, value] of Object.entries(oldConfig)) {
      storage.set(key, value);
    }
    storage.remove('commonConfig');
  }
};

export const CommonConfigProvider = ({ children }: Props) => {
  const storage = useWebStorage();
  migrateOldConfig(storage);

  const savedConfig: CommonConfig = {
    time: storage.get('time') ?? true,
    zoomReihung: storage.get('zoomReihung') ?? true,
    showUIC: storage.get('showUIC') ?? false,
    fahrzeugGruppe: storage.get('fahrzeugGruppe') ?? false,
    checkIn: storage.get('checkIn') ?? CheckInType.Travelynx,
    ...global.configOverride.common,
  };

  return (
    <CommonConfigContainer.Provider initialState={savedConfig}>
      {children}
    </CommonConfigContainer.Provider>
  );
};
