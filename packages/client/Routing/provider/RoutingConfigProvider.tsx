import { useCallback, useMemo, useState } from 'react';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Station } from 'types/station';
import type { SyntheticEvent } from 'react';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
  onlyRegional: boolean;
  hafasProfile: AllowedHafasProfile;
}

const useRoutingConfigInternal = ({
  initialSettings,
}: {
  initialSettings: RoutingSettings;
}) => {
  const [start, setStart] = useState<Station>();
  const [destination, setDestination] = useState<Station>();
  const [via, setVia] = useState<Station[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [settings, setSettings] = useState<RoutingSettings>(initialSettings);
  const storage = useStorage();

  const updateSetting = useCallback(
    <K extends keyof RoutingSettings>(key: K, value: RoutingSettings[K]) => {
      storage.set(key, value);
      setSettings((oldSettings) => ({
        ...oldSettings,
        [key]: value,
      }));
    },
    [storage],
  );

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
    [destination, start],
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
    settings,
    updateSetting,
  };
};

export const [
  RoutingConfigProvider,
  useRoutingConfig,
  useRoutingSettings,
  useRoutingConfigActions,
] = constate(
  useRoutingConfigInternal,
  (v) => ({
    start: v.start,
    destination: v.destination,
    date: v.date,
    via: v.via,
  }),
  (v) => v.settings,
  (v) => ({
    setStart: v.setStart,
    setDestination: v.setDestination,
    setDate: v.setDate,
    updateVia: v.updateVia,
    swapStartDestination: v.swapStartDestination,
    updateSettings: v.updateSetting,
  }),
);
