import { addHours, subMinutes } from 'date-fns';
import { createContainer } from 'unstated-next';
import { Formation } from 'types/reihung';
import { useState } from 'react';
import axios from 'axios';

function useReihung() {
  const [reihungen, setReihungen] = useState<{
    [key: string]: undefined | null | Formation;
  }>({});
  const [auslastungen, setAuslastungen] = useState<any>({});
  const getReihung = async (
    trainNumber: string,
    currentStation: string,
    scheduledDeparture: number
  ) => {
    let reihung: Formation | undefined | null;

    try {
      reihung = (await axios.get(
        `/api/reihung/v1/wagen/${trainNumber}/${scheduledDeparture}`
      )).data;
    } catch (e) {
      reihung = null;
    }

    const key = trainNumber + currentStation + scheduledDeparture;

    setReihungen(oldReihungen => ({
      ...oldReihungen,
      [key]: reihung,
    }));

    try {
      if (reihung && reihung.zuggattung === 'ICE') {
        const stationId = reihung.halt.evanummer;
        const trainId = reihung.zuggattung + reihung.zugnummer;
        const timeStart =
          reihung.halt.ankunftszeit &&
          subMinutes(scheduledDeparture, 5).toISOString();
        const timeEnd =
          reihung.halt.abfahrtszeit &&
          addHours(scheduledDeparture, 6).toISOString();

        if (timeStart && timeEnd) {
          const auslastung = (await axios.get(
            `/api/reihung/v1/auslastung/${trainId}/${stationId}/${timeStart}/${timeEnd}`
          )).data;

          setAuslastungen((oldAuslastung: any) => ({
            ...oldAuslastung,
            [key]: auslastung,
          }));
        }
      }
    } catch (e) {
      setAuslastungen((oldAuslastungen: any) => ({
        ...oldAuslastungen,
        [key]: null,
      }));
    }
  };
  const clearReihungen = () => setReihungen({});

  return { reihungen, getReihung, clearReihungen, auslastungen };
}

export default createContainer(useReihung);
