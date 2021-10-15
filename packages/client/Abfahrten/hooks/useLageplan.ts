import { useEffect, useState } from 'react';
import Axios from 'axios';
import type { LageplanResponse } from 'types/bahnhof';

export const useLageplan = (
  stationName?: string,
  evaId?: string,
): string | undefined => {
  const [lageplan, setLageplan] = useState<string>();

  useEffect(() => {
    if (!stationName || !evaId) return;
    Axios.get<LageplanResponse>(
      `/api/stopPlace/v1/lageplan/${encodeURIComponent(stationName)}/${evaId}`,
    )
      .then((r) => setLageplan(r.data.lageplan))
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }, [setLageplan, stationName, evaId]);

  return lageplan;
};
