import { AllowedHafasProfile } from 'types/HAFAS';
import { createContainer } from 'unstated-next';
import { useCallback, useMemo, useState } from 'react';
import useWebStorage from 'client/useWebStorage';
import type { Station } from 'types/station';
import type { SyntheticEvent } from 'react';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
  onlyRegional: boolean;
  hafasProfile: AllowedHafasProfile;
}

const useRoutingSettings = (initialSettings: RoutingSettings) => {
  const [settings, setSettings] = useState<RoutingSettings>(initialSettings);
  const storage = useWebStorage();

  const updateSetting = useCallback(
    <K extends keyof RoutingSettings>(key: K, value: RoutingSettings[K]) => {
      storage.set(key, value);
      setSettings((oldSettings) => ({
        ...oldSettings,
        [key]: value,
      }));
    },
    [storage]
  );

  return {
    settings,
    updateSetting,
  };
};

const useRoutingConfig = (initialState: RoutingSettings) => {
  const [start, setStart] = useState<Station>();
  const [destination, setDestination] = useState<Station>();
  const [via, setVia] = useState<Station[]>([]);
  const [date, setDate] = useState<Date | null>(null);

  const updateVia = useCallback((index: number, station?: Station) => {
    setVia((oldVia) => {
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

  const swapStartDestination = useMemo(
    () => (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDestination(start);
      setStart(destination);
    },
    [destination, start]
  );

  return {
    start,
    setStart,
    destination,
    setDestination,
    date,
    setDate,
    via,
    updateVia,
    swapStartDestination,
    ...useRoutingSettings(initialState),
  };
};

// @ts-expect-error This works, we always supply a value
const RoutingConfigContainer = createContainer(useRoutingConfig);

export default RoutingConfigContainer;
