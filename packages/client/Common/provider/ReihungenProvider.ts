import { useCallback, useState } from 'react';
import Axios from 'axios';
import constate from 'constate';
import type { Formation } from 'types/reihung';

async function fetchSequence(
  trainNumber: string,
  scheduledDeparture: number
): Promise<Formation | undefined> {
  try {
    const r = await Axios.get<Formation>(
      `/api/reihung/v1/wagen/${trainNumber}/${scheduledDeparture}`
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
      fallbackTrainNumbers: string[] = []
    ) => {
      let reihung: Formation | undefined | null;

      reihung = await fetchSequence(trainNumber, scheduledDeparture);
      if (!reihung) {
        for (const fallbackTrainNumber of fallbackTrainNumbers) {
          // eslint-disable-next-line no-await-in-loop
          reihung = await fetchSequence(
            fallbackTrainNumber,
            scheduledDeparture
          );
          if (reihung) break;
        }
      }

      if (!reihung) {
        reihung = null;
      }
      const key = trainNumber + currentStation + scheduledDeparture;

      setReihungen((oldReihungen) => ({
        ...oldReihungen,
        [key]: reihung,
      }));
    },
    []
  );
  const clearReihungen = useCallback(() => setReihungen({}), []);

  return { reihungen, getReihung, clearReihungen };
}

export const [ReihungenProvider, useReihungen, useReihungenActions] = constate(
  useReihungInner,
  (v) => v.reihungen,
  ({ reihungen, ...actions }) => actions
);
