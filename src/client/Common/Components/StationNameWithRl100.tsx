import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useStopPlace } from '@/client/Common/hooks/useStopPlace';
import type { FC } from 'react';
import type { MinimalStopPlace } from '@/types/stopPlace';

export const StationNameWithRL100: FC<{
  station: MinimalStopPlace;
}> = ({ station }) => {
  const { showRl100 } = useCommonConfig();
  const stopPlace = useStopPlace(station.evaNumber, !showRl100);

  if (!showRl100 || !stopPlace?.ril100) {
    return <>{station.name}</>;
  }
  return (
    <>
      {station.name} [{stopPlace.ril100}]
    </>
  );
};
