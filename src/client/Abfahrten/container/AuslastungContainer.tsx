import { createContainer } from 'unstated-next';
import { Route$Auslastung } from 'types/routing';
import { useState } from 'react';
import axios from 'axios';

function useAuslastung() {
  const [auslastungen, setAuslastungen] = useState<{
    [key: string]: undefined | null | Route$Auslastung;
  }>({});
  const getAuslastung = async (
    trainNumber: string,
    start: string,
    destination: string,
    time: number
  ) => {
    const key = `${start}/${destination}/${trainNumber}`;
    let auslastung;

    try {
      auslastung = (await axios.get(`/api/hafas/v1/auslastung/${key}/${time}`))
        .data;
    } catch (e) {
      auslastung = null;
    }

    setAuslastungen({
      ...auslastungen,
      [key]: auslastung,
    });
  };
  const clearAuslastungen = () => setAuslastungen({});

  return { auslastungen, getAuslastung, clearAuslastungen };
}

export default createContainer(useAuslastung);
