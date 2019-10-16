import { createContainer } from 'unstated-next';
import { Station } from 'types/api/station';
import { useCallback, useState } from 'react';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
}

const useRoutingSettings = () => {
  const [settings, setSettings] = useState<RoutingSettings>({
    maxChanges: '-1',
    transferTime: '0',
  });

  const updateSetting = useCallback(
    <K extends keyof RoutingSettings>(key: K, value: RoutingSettings[K]) => {
      setSettings(oldSettings => ({
        ...oldSettings,
        [key]: value,
      }));
    },
    []
  );

  return {
    settings,
    updateSetting,
  };
};

const useRoutingConfig = () => {
  const [start, setStart] = useState<Station>();
  const [destination, setDestination] = useState<Station>();
  const [date, setDate] = useState<Date | null>(null);

  return {
    start,
    setStart,
    destination,
    setDestination,
    date,
    setDate,
    ...useRoutingSettings(),
  };
};

const RoutingConfigContainer = createContainer(useRoutingConfig);

export default RoutingConfigContainer;
