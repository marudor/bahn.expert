import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Formation } from 'types/reihung';

async function fetchSequence(
  trainNumber: string,
  scheduledDeparture: number,
): Promise<Formation | undefined> {
  try {
    const r = await Axios.get<Formation>(
      `/api/reihung/v1/wagen/${trainNumber}/${scheduledDeparture}`,
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
      currentStation: string,
      scheduledDeparture: number,
      fallbackTrainNumbers: string[] = [],
    ) => {
      let reihung: Formation | undefined | null;

      const reihungen = await Promise.all([
        fetchSequence(trainNumber, scheduledDeparture),
        ...fallbackTrainNumbers.map((fallback) =>
          fetchSequence(fallback, scheduledDeparture),
        ),
      ]);
      const newReihungen = reihungen.reduce((agg, f) => {
        if (f) {
          agg[f.zugnummer + currentStation + scheduledDeparture] = f;
        }
        return agg;
      }, {} as Record<string, Formation>);
      reihung = reihungen.find((f) => f);
      if (!reihung) {
        reihung = null;
      }
      const key = trainNumber + currentStation + scheduledDeparture;

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
