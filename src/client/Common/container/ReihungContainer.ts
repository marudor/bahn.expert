import { createContainer } from 'unstated-next';
import { Formation } from 'types/reihung';
import { useState } from 'react';
import axios from 'axios';

function fetchSequence(
  trainNumber: string,
  scheduledDeparture: number
): Promise<Formation | undefined> {
  return axios
    .get(`/api/reihung/v1/wagen/${trainNumber}/${scheduledDeparture}`)
    .then((r) => r.data)
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

export default createContainer(useReihung);
