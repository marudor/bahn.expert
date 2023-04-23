import { useCallback } from 'react';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import type { MinimalStopPlace } from '@/types/stopPlace';

export const useFormatStopPlaceName: () => (
  stopPlace: MinimalStopPlace,
) => string = () => {
  const { showRl100 } = useCommonConfig();

  return useCallback(
    (stopPlace: MinimalStopPlace) => {
      let r = stopPlace.name;
      if (showRl100 && stopPlace.identifier?.ril100) {
        r += ` [${stopPlace.identifier.ril100}]`;
      }
      return r;
    },
    [showRl100],
  );
};
