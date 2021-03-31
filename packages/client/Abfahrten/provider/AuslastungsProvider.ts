import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Route$Auslastung } from 'types/routing';
import type { TrainOccupancyList } from 'types/stopPlace';

function useAuslastungInner() {
  const [auslastungen, setAuslastungen] = useState<{
    [key: string]: undefined | null | Route$Auslastung;
  }>({});
  const getAuslastung = useCallback(
    async (
      trainNumber: string,
      start: string,
      destination: string,
      time: Date,
    ) => {
      const key = `${start}/${destination}/${trainNumber}`;
      let auslastung: Route$Auslastung | null;

      try {
        auslastung = (
          await Axios.get<Route$Auslastung>(
            `/api/hafas/v2/auslastung/${key}/${time.toISOString()}`,
          )
        ).data;
      } catch (e) {
        auslastung = null;
      }

      setAuslastungen((oldAuslastungen) => ({
        ...oldAuslastungen,
        [key]: auslastung,
      }));
    },
    [],
  );

  const [vrrAuslastungen, setVRRAuslastungen] = useState<{
    [evaNumber: string]: undefined | null | TrainOccupancyList;
  }>({});
  const fetchVRRAuslastung = useCallback(async (evaNumber: string) => {
    let occupancyList: TrainOccupancyList | null;
    try {
      occupancyList = (
        await Axios.get<TrainOccupancyList>(
          `api/stopPlace/v1/${evaNumber}/trainOccupancy`,
        )
      ).data;
    } catch {
      occupancyList = null;
    }
    setVRRAuslastungen((old) => ({
      ...old,
      [evaNumber]: occupancyList,
    }));
  }, []);

  const getVRRAuslastung = useCallback(
    (evaNumber: string, trainNumber: string) => {
      const auslastungForEva = vrrAuslastungen[evaNumber];
      if (!auslastungForEva) return auslastungForEva;
      return auslastungForEva[trainNumber] || null;
    },
    [vrrAuslastungen],
  );

  return {
    auslastungen,
    getAuslastung,
    fetchVRRAuslastung,
    getVRRAuslastung,
  };
}

export const [AuslastungsProvider, useAuslastung, useVRRAuslastung] = constate(
  useAuslastungInner,
  ({ fetchVRRAuslastung, getVRRAuslastung, ...r }) => r,
  ({ auslastungen, getAuslastung, ...r }) => r,
);
