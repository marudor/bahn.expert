import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Formation } from 'types/reihung';

async function fetchSequence(
  trainNumber: string,
  scheduledDeparture: Date,
  evaNumber: string,
  trainType?: string,
): Promise<Formation | undefined> {
  try {
    const r = await Axios.get<Formation>(
      `/api/reihung/v2/wagen/${trainNumber}/${scheduledDeparture.toISOString()}`,
      {
        params: {
          evaNumber,
          trainType,
        },
      },
    );
    return r.data;
  } catch (e) {
    return undefined;
  }
}

function useReihungInner() {
  const [reihungen, setReihungen] = useState<{
    [key: string]: undefined | null | Formation;
  }>({});
  const getReihung = useCallback(
    async (
      trainNumber: string,
      trainType: string | undefined,
      currentEvaNumber: string,
      scheduledDeparture: Date,
      fallbackTrainNumbers: string[] = [],
    ) => {
      let reihung: Formation | undefined | null;

      const reihungen = await Promise.all([
        fetchSequence(
          trainNumber,
          scheduledDeparture,
          currentEvaNumber,
          trainType,
        ),
        ...fallbackTrainNumbers.map((fallback) =>
          fetchSequence(
            fallback,
            scheduledDeparture,
            currentEvaNumber,
            trainType,
          ),
        ),
      ]);
      const newReihungen = reihungen.reduce((agg, f) => {
        if (f) {
          agg[
            `${
              f.zugnummer
            }${currentEvaNumber}${scheduledDeparture.toISOString()}`
          ] = f;
        }
        return agg;
      }, {} as Record<string, Formation>);
      reihung = reihungen.find((f) => f);
      if (!reihung) {
        reihung = null;
      }
      const key = `${trainNumber}${currentEvaNumber}${scheduledDeparture.toISOString()}`;

      setReihungen((oldReihungen) => ({
        ...oldReihungen,
        ...newReihungen,
        [key]: reihung,
      }));
    },
    [],
  );
  const clearReihungen = useCallback(() => setReihungen({}), []);

  return { reihungen, getReihung, clearReihungen };
}

export const [ReihungenProvider, useReihungen, useReihungenActions] = constate(
  useReihungInner,
  (v) => v.reihungen,
  ({ reihungen, ...actions }) => actions,
);
