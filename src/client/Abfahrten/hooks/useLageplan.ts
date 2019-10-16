import { useEffect, useState } from 'react';
import Axios from 'axios';

const useLageplan = (stationName?: string) => {
  const [lageplan, setLageplan] = useState<string>();

  useEffect(() => {
    if (!stationName) return;
    Axios.get(`/api/bahnhof/current/lageplan/${stationName}`).then(r => {
      setLageplan(r.data.lageplan);
    });
  }, [setLageplan, stationName]);

  return lageplan;
};

export default useLageplan;
