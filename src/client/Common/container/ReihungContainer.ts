import { createContainer } from 'unstated-next';
import { Formation } from 'types/reihung';
import { useState } from 'react';
import axios from 'axios';

function useReihung() {
  const [reihungen, setReihungen] = useState<{
    [key: string]: undefined | null | Formation;
  }>({});
  const getReihung = async (
    trainNumber: string,
    currentStation: string,
    scheduledDeparture: number
  ) => {
    let reihung: Formation | undefined | null;

    try {
      reihung = (
        await axios.get(
          `/api/reihung/v1/wagen/${trainNumber}/${scheduledDeparture}`
        )
      ).data;
    } catch (e) {
      reihung = null;
    }

    const key = trainNumber + currentStation + scheduledDeparture;

    setReihungen(oldReihungen => ({
      ...oldReihungen,
      [key]: reihung,
    }));
  };
  const clearReihungen = () => setReihungen({});

  return { reihungen, getReihung, clearReihungen };
}

export default createContainer(useReihung);
