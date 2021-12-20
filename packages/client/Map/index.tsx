import { MapProvider } from 'client/Map/provider/MapProvider';
import { NoSsr } from '@mui/material';
import loadable from '@loadable/component';
import type { FC } from 'react';

const LazyTrainMap = loadable(() => import('./Components/TrainMap'));

export const Map: FC = () => (
  <NoSsr>
    <MapProvider>
      <LazyTrainMap />
    </MapProvider>
  </NoSsr>
);
// eslint-disable-next-line import/no-default-export
export default Map;
