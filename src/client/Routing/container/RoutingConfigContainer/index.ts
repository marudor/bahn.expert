import { createContainer } from 'unstated-next';
import { setCookieOptions } from 'client/util';
import { Station } from 'types/api/station';
import { useCallback, useState } from 'react';
import useCookies from 'Common/useCookies';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
}

export const defaultRoutingSettings: RoutingSettings = {
  maxChanges: '-1',
  transferTime: '0',
};

const useRoutingSettings = (initialSettings: RoutingSettings) => {
  const [settings, setSettings] = useState<RoutingSettings>(initialSettings);
  const cookies = useCookies();

  const updateSetting = useCallback(
    <K extends keyof RoutingSettings>(key: K, value: RoutingSettings[K]) => {
      setSettings(oldSettings => {
        const newSettings = {
          ...oldSettings,
          [key]: value,
        };

        cookies.set('rconfig', newSettings, setCookieOptions);

        return newSettings;
      });
    },
    [cookies]
  );

  return {
    settings,
    updateSetting,
  };
};

const useRoutingConfig = (
  initialState: RoutingSettings = defaultRoutingSettings
) => {
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
    ...useRoutingSettings(initialState),
  };
};

const RoutingConfigContainer = createContainer(useRoutingConfig);

export default RoutingConfigContainer;
