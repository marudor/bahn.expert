import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import { useStopPlace } from '@/client/Common/hooks/useStopPlace';
import type { FC } from 'react';
import type { RoutingStation } from '@/types/routing';

export const StationNameWithRL100: FC<{
  station: RoutingStation;
}> = ({ station }) => {
  const { showRl100 } = useCommonConfig();
  const stopPlace = useStopPlace(station.id, !showRl100);

  if (!showRl100 || !stopPlace?.identifier?.ril100) {
    return <>{station.title}</>;
  }
  return (
    <>
      {station.title} [{stopPlace.identifier.ril100}]
    </>
  );
};
