import { useEffect, useState } from 'react';
import request from 'umi-request';
const useLageplan = (stationName?: string, evaId?: string) => {
  const [lageplan, setLageplan] = useState<string>();

  useEffect(() => {
    if (!stationName || !evaId) return;
    request
      .get(
        `/api/bahnhof/v1/lageplan/${encodeURIComponent(stationName)}/${evaId}`
      )
      .then((r) => setLageplan(r.lageplan))
      .catch(() => {});
  }, [setLageplan, stationName, evaId]);

  return lageplan;
};

export default useLageplan;
