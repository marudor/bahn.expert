import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Abfahrt } from 'types/iris';
import type { Route$Auslastung } from 'types/routing';
import type { TrainOccupancyList } from 'types/stopPlace';

function getAuslastungKey(abfahrt: Abfahrt) {
  return `${encodeURIComponent(
    abfahrt.currentStopPlace.name,
  )}/${encodeURIComponent(abfahrt.destination)}/${abfahrt.train.number}`;
}

function useAuslastungInner() {
  const [auslastungen, setAuslastungen] = useState<{
    [key: string]: undefined | null | Route$Auslastung;
  }>({});
  const fetchDBAuslastung = useCallback(async (abfahrt: Abfahrt) => {
    if (!abfahrt.departure) {
      return;
    }
    const key = getAuslastungKey(abfahrt);
    let auslastung: Route$Auslastung | null;

    try {
      auslastung = (
        await Axios.get<Route$Auslastung>(
          `/api/hafas/v2/auslastung/${key}/${abfahrt.departure?.scheduledTime.toISOString()}`,
        )
      ).data;
    } catch (e) {
      auslastung = null;
    }

    setAuslastungen((oldAuslastungen) => ({
      ...oldAuslastungen,
      [key]: auslastung,
    }));
  }, []);

  const [vrrAuslastungen, setVRRAuslastungen] = useState<{
    [evaNumber: string]: undefined | null | TrainOccupancyList;
  }>({});
  const fetchVRRAuslastung = useCallback(async (abfahrt: Abfahrt) => {
    let occupancyList: TrainOccupancyList | null;
    try {
      occupancyList = (
        await Axios.get<TrainOccupancyList>(
          `api/stopPlace/v1/${abfahrt.currentStopPlace.evaNumber}/trainOccupancy`,
        )
      ).data;
    } catch {
      occupancyList = null;
    }
    setVRRAuslastungen((old) => ({
      ...old,
      [abfahrt.currentStopPlace.evaNumber]: occupancyList,
    }));
  }, []);

  const getVRRAuslastung = useCallback(
    (abfahrt: Abfahrt) => {
      const auslastungForEva =
        vrrAuslastungen[abfahrt.currentStopPlace.evaNumber];
      if (!auslastungForEva) return auslastungForEva;
      return auslastungForEva[abfahrt.train.number] || null;
    },
    [vrrAuslastungen],
  );

  const getDBAuslastung = useCallback(
    (abfahrt: Abfahrt) => {
      return auslastungen[getAuslastungKey(abfahrt)];
    },
    [auslastungen],
  );

  return {
    fetchDBAuslastung,
    getDBAuslastung,
    fetchVRRAuslastung,
    getVRRAuslastung,
  };
}

export const [AuslastungsProvider, useAuslastung] =
  constate(useAuslastungInner);
