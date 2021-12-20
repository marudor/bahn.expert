import { useCallback, useMemo, useState } from 'react';
import { useStorage } from 'client/useStorage';
import constate from 'constate';
import type { FC, SyntheticEvent } from 'react';
import type { MinimalStopPlace } from 'types/stopPlace';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
  onlyRegional: boolean;
}

const useRoutingConfigInternal = ({
  initialSettings,
}: {
  initialSettings: RoutingSettings;
}) => {
  const [start, setStart] = useState<MinimalStopPlace>();
  const [destination, setDestination] = useState<MinimalStopPlace>();
  const [via, setVia] = useState<MinimalStopPlace[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [touchedDate, setTouchedDate] = useState(false);
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

  const updateVia = useCallback(
    (index: number, stopPlace?: MinimalStopPlace) => {
      setVia((oldVia) => {
        if (!stopPlace) {
          return oldVia.filter((_, i) => i !== index);
        }
        if (index < 0) {
          oldVia.push(stopPlace);
        } else {
          oldVia[index] = stopPlace;
        }

        return [...oldVia];
      });
    },
    [],
  );

  const swapStartDestination = useMemo(
    () => (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDestination(start);
      setStart(destination);
    },
    [destination, start],
  );

  const setDateWithTouched = useCallback((date: Date | null) => {
    setTouchedDate(Boolean(date));
    if (!date) {
      date = new Date();
    }
    setDate(date);
  }, []);

  return {
    start,
    setStart,
    destination,
    setDestination,
    date,
    setDate: setDateWithTouched,
    touchedDate,
    via,
    updateVia,
    setVia,
    swapStartDestination,
    settings,
    updateSetting,
  };
};

export const [
  InnerRoutingConfigProvider,
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
    touchedDate: v.touchedDate,
  }),
  (v) => v.settings,
  (v) => ({
    setStart: v.setStart,
    setDestination: v.setDestination,
    setDate: v.setDate,
    updateVia: v.updateVia,
    setVia: v.setVia,
    swapStartDestination: v.swapStartDestination,
    updateSettings: v.updateSetting,
  }),
);

export const RoutingConfigProvider: FC = ({ children }) => {
  const storage = useStorage();

  const savedRoutingSettings: RoutingSettings = {
    maxChanges: storage.get('maxChanges') ?? '-1',
    transferTime: storage.get('transferTime') ?? '0',
    onlyRegional: storage.get('onlyRegional') ?? false,
  };

  return (
    <InnerRoutingConfigProvider initialSettings={savedRoutingSettings}>
      {children}
    </InnerRoutingConfigProvider>
  );
};
