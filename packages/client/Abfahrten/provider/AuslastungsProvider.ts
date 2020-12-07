import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Route$Auslastung } from 'types/routing';

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
  const clearAuslastungen = useCallback(() => setAuslastungen({}), []);

  return { auslastungen, getAuslastung, clearAuslastungen };
}

export const [AuslastungsProvider, useAuslastung] = constate(
  useAuslastungInner,
);
