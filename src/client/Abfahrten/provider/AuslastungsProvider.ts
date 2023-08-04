import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Abfahrt } from '@/types/iris';
import type { PropsWithChildren } from 'react';
import type { Route$Auslastung } from '@/types/routing';
import type { TrainOccupancyList } from '@/types/stopPlace';

function getAuslastungKey(abfahrt: Abfahrt) {
  return `${encodeURIComponent(
    abfahrt.currentStopPlace.name,
  )}/${encodeURIComponent(abfahrt.destination)}/${abfahrt.train.number}`;
}

function useAuslastungInner(_p: PropsWithChildren<unknown>) {
  const [auslastungen, setAuslastungen] = useState<
    Record<string, undefined | null | Route$Auslastung>
  >({});
  const fetchDBAuslastung = useCallback(async (abfahrt: Abfahrt) => {
    if (!abfahrt.departure) {
      return;
    }
    const key = getAuslastungKey(abfahrt);
    let auslastung: Route$Auslastung | null;

    try {
      auslastung = (
        await Axios.get<Route$Auslastung>(
          `/api/hafas/v3/occupancy/${key}/${abfahrt.departure?.scheduledTime.toISOString()}/${
            abfahrt.currentStopPlace.evaNumber
          }`,
        )
      ).data;
    } catch {
      auslastung = null;
    }

    setAuslastungen((oldAuslastungen) => ({
      ...oldAuslastungen,
      [key]: auslastung,
    }));
  }, []);

  const [vrrAuslastungen, setVRRAuslastungen] = useState<
    Record<string, undefined | null | TrainOccupancyList>
  >({});

  const getAuslastung = useCallback(
    (abfahrt: Abfahrt) => {
      const vrrAuslastungForEva =
        vrrAuslastungen[abfahrt.currentStopPlace.evaNumber];
      const vrrAuslastung = vrrAuslastungForEva?.[abfahrt.train.number];
      if (vrrAuslastung) {
        return vrrAuslastung;
      }

      const auslastungKey = getAuslastungKey(abfahrt);
      const dbAuslastung = auslastungen[auslastungKey];
      if (dbAuslastung === undefined && abfahrt.departure) {
        void fetchDBAuslastung(abfahrt);
      } else {
        return dbAuslastung;
      }
    },
    [vrrAuslastungen, fetchDBAuslastung, auslastungen],
  );

  const fetchVRRAuslastungForEva = useCallback(async (eva: string) => {
    let occupancyList: TrainOccupancyList | null;
    try {
      occupancyList = (
        await Axios.get<TrainOccupancyList>(
          `/api/stopPlace/v1/${eva}/trainOccupancy`,
        )
      ).data;
    } catch {
      occupancyList = null;
    }
    setVRRAuslastungen((old) => ({
      ...old,
      [eva]: occupancyList,
    }));
  }, []);

  return {
    getAuslastung,
    fetchVRRAuslastungForEva,
  };
}

export const [AuslastungsProvider, useAuslastung] =
  constate(useAuslastungInner);
