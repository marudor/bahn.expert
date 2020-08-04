import { useEffect, useState } from 'react';
import Axios from 'axios';

export const useLageplan = (stationName?: string, evaId?: string) => {
  const [lageplan, setLageplan] = useState<string>();

  useEffect(() => {
    if (!stationName || !evaId) return;
    Axios.get(
      `/api/bahnhof/v1/lageplan/${encodeURIComponent(stationName)}/${evaId}`
    )
      .then((r) => setLageplan(r.data.lageplan))
      .catch(() => {});
  }, [setLageplan, stationName, evaId]);

  return lageplan;
};
