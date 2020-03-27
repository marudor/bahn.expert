import { useEffect, useState } from 'react';
import Axios from 'axios';

const useLageplan = (stationName?: string) => {
  const [lageplan, setLageplan] = useState<string>();

  useEffect(() => {
    if (!stationName) return;
    Axios.get(`/api/bahnhof/v1/lageplan/${encodeURIComponent(stationName)}`)
      .then((r) => {
        setLageplan(r.data.lageplan);
      })
      .catch(() => {});
  }, [setLageplan, stationName]);

  return lageplan;
};

export default useLageplan;
