import {
  addDays,
  endOfDay,
  isSameDay,
  isSameYear,
  isWithinInterval,
  lightFormat,
  startOfDay,
  subDays,
} from 'date-fns';
import { AllowedHafasProfile } from '@/types/HAFAS';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStorage } from '@/client/useStorage';
import constate from 'constate';
import deLocale from 'date-fns/locale/de';
import type { FC, PropsWithChildren, SyntheticEvent } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

export interface RoutingSettings {
  maxChanges: string;
  transferTime: string;
  onlyRegional: boolean;
  onlyNetzcard: boolean;
  hafasProfile?: AllowedHafasProfile.DB | AllowedHafasProfile.OEBB;
}

const useRoutingConfigInternal = ({
  initialSettings,
}: PropsWithChildren<{
  initialSettings: RoutingSettings;
}>) => {
  const [start, setStart] = useState<MinimalStopPlace>();
  const [destination, setDestination] = useState<MinimalStopPlace>();
  const [via, setVia] = useState<MinimalStopPlace[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [touchedDate, setTouchedDate] = useState(false);
  const [settings, setSettings] = useState<RoutingSettings>(initialSettings);
  const [departureMode, setDepartureMode] = useState<'an' | 'ab'>('ab');
  const [formattedDate, setFormattedDate] = useState('');
  const storage = useStorage();

  const updateFormattedDate = useCallback(() => {
    if (!touchedDate) {
      setFormattedDate(`Jetzt (Heute ${lightFormat(new Date(), 'HH:mm')})`);
      return;
    }
    const today = startOfDay(new Date());
    const tomorrow = endOfDay(addDays(today, 1));
    const yesterday = subDays(today, 1);

    let relativeDayString = '';

    if (isWithinInterval(date, { start: yesterday, end: tomorrow })) {
      if (isSameDay(date, today)) relativeDayString = 'Heute';
      else if (isSameDay(date, yesterday)) relativeDayString = 'Gestern';
      else if (isSameDay(date, tomorrow)) relativeDayString = 'Morgen';
      relativeDayString += `, ${deLocale.localize?.day(date.getDay(), {
        width: 'short',
      })}`;
    } else {
      relativeDayString = deLocale.localize?.day(date.getDay());
    }
    relativeDayString += ` ${lightFormat(date, 'dd.MM.')}`;
    if (!isSameYear(date, today)) {
      relativeDayString += lightFormat(date, 'yyyy');
    }
    relativeDayString += ` ${lightFormat(date, 'HH:mm')}`;

    setFormattedDate(relativeDayString);
  }, [touchedDate, date]);
  useEffect(() => {
    updateFormattedDate();
  }, [updateFormattedDate]);

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

  const updateDepartureMode = useCallback((_e: any, value: string) => {
    if (value === 'ab' || value === 'an') {
      setDepartureMode(value);
    }
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
    departureMode,
    updateDepartureMode,
    formattedDate,
    updateFormattedDate,
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
    departureMode: v.departureMode,
    formattedDate: v.formattedDate,
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
    updateDepartureMode: v.updateDepartureMode,
    updateFormattedDate: v.updateFormattedDate,
  }),
);

export const RoutingConfigProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const storage = useStorage();

  const savedRoutingSettings: RoutingSettings = {
    maxChanges: storage.get('maxChanges') ?? '-1',
    transferTime: storage.get('transferTime') ?? '0',
    onlyRegional: storage.get('onlyRegional') ?? false,
    onlyNetzcard: storage.get('onlyNetzcard') ?? false,
    hafasProfile: storage.get('hafasProfile') ?? AllowedHafasProfile.DB,
  };

  return (
    <InnerRoutingConfigProvider initialSettings={savedRoutingSettings}>
      {children}
    </InnerRoutingConfigProvider>
  );
};
