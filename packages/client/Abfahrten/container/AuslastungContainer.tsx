import { createContainer } from 'unstated-next';
import { useState } from 'react';
import request from 'umi-request';
import type { Route$Auslastung } from 'types/routing';

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
      auslastung = await request.get(`/api/hafas/v1/auslastung/${key}/${time}`);
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
