import { useEffect, useState } from 'react';
import Axios from 'axios';
import type { GroupedStopPlace } from '@/types/stopPlace';

export const useStopPlace = (
  evaNumber: string,
  skip?: boolean,
): GroupedStopPlace | undefined => {
  const [stopPlace, setStopPlace] = useState<GroupedStopPlace>();
  useEffect(() => {
    if (!skip) {
      void Axios.get<GroupedStopPlace>(`/api/stopplace/v1/${evaNumber}`).then(
        (result) => setStopPlace(result.data),
      );
    }
  }, [evaNumber, skip]);

  return stopPlace;
};
