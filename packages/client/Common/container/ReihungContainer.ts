import { createContainer } from 'unstated-next';
import { useState } from 'react';
import request from 'umi-request';
import type { Formation } from 'types/reihung';

function fetchSequence(
  trainNumber: string,
  scheduledDeparture: number
): Promise<Formation | undefined> {
  return request
    .get<Formation>(
      `/api/reihung/v1/wagen/${trainNumber}/${scheduledDeparture}`
    )
    .catch(() => undefined);
}

function useReihung() {
  const [reihungen, setReihungen] = useState<{
    [key: string]: undefined | null | Formation;
  }>({});
  const getReihung = async (
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
        reihung = await fetchSequence(fallbackTrainNumber, scheduledDeparture);
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
  };
  const clearReihungen = () => setReihungen({});

  return { reihungen, getReihung, clearReihungen };
}

export const ReihungContainer = createContainer(useReihung);
