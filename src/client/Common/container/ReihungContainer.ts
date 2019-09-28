import { createContainer } from 'unstated-next';
import { Reihung } from 'types/reihung';
import { useState } from 'react';
import axios from 'axios';

function useReihung() {
  const [reihungen, setReihungen] = useState<{
    [key: string]: undefined | null | Reihung;
  }>({});
  const getReihung = async (
    trainNumber: string,
    currentStation: string,
    scheduledDeparture: number
  ) => {
    let reihung;

    try {
      reihung = (await axios.get(
        `/api/reihung/current/wagen/${trainNumber}/${scheduledDeparture}`
      )).data;
    } catch (e) {
      reihung = null;
    }

    setReihungen({
      ...reihungen,
      [trainNumber + currentStation + scheduledDeparture]: reihung,
    });
  };
  const clearReihungen = () => setReihungen({});

  return { reihungen, getReihung, clearReihungen };
}

export default createContainer(useReihung);
