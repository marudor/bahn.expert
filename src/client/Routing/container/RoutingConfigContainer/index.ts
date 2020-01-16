import { AllowedHafasProfile } from 'types/HAFAS';
import { createContainer } from 'unstated-next';
import { Station } from 'types/station';
import { useCallback, useState } from 'react';
import useStorage from 'shared/hooks/useStorage';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
  onlyRegional?: boolean;
  hafasProfile: AllowedHafasProfile;
}

export const defaultRoutingSettings: RoutingSettings = {
  maxChanges: '-1',
  transferTime: '0',
  hafasProfile: AllowedHafasProfile.db,
};

const useRoutingSettings = (initialSettings: RoutingSettings) => {
  const [settings, setSettings] = useState<RoutingSettings>(initialSettings);
  const storage = useStorage();

  const updateSetting = useCallback(
    <K extends keyof RoutingSettings>(key: K, value: RoutingSettings[K]) => {
      setSettings(oldSettings => {
        const newSettings = {
          ...oldSettings,
          [key]: value,
        };

        storage.set('rconfig', newSettings);

        return newSettings;
      });
    },
    [storage]
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
  const [via, setVia] = useState<Station[]>([]);
  const [date, setDate] = useState<Date | null>(null);

  const updateVia = useCallback((index: number, station?: Station) => {
    setVia(oldVia => {
      if (!station) {
        return oldVia.filter((_, i) => i !== index);
      }
      if (index < 0) {
        oldVia.push(station);
      } else {
        oldVia[index] = station;
      }

      return [...oldVia];
    });
  }, []);

  return {
    start,
    setStart,
    destination,
    setDestination,
    date,
    setDate,
    via,
    updateVia,
    ...useRoutingSettings(initialState),
  };
};

const RoutingConfigContainer = createContainer(useRoutingConfig);

export default RoutingConfigContainer;
