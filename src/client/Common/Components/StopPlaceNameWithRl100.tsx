import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useStopPlace } from '@/client/Common/hooks/useStopPlace';
import type { FC } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

export const StopPlaceNameWithRl100: FC<{
  stopPlace: MinimalStopPlace;
}> = ({ stopPlace }) => {
  const { showRl100 } = useCommonConfig();
  const fetchedStopPlace = useStopPlace(
    stopPlace.evaNumber,
    Boolean(stopPlace.ril100) || !showRl100,
  );
  const rl100 = stopPlace.ril100 || fetchedStopPlace?.ril100;

  if (!showRl100 || !rl100) {
    return <>{stopPlace.name}</>;
  }
  return (
    <>
      {stopPlace.name} [{rl100}]
    </>
  );
};
