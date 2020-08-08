import { MapProvider } from 'client/Map/provider/MapProvider';
import { NoSsr } from '@material-ui/core';
import loadable from '@loadable/component';

const LazyTrainMap = loadable(() => import('./Components/TrainMap'));

export const Map = () => (
  <NoSsr>
    <MapProvider>
      <LazyTrainMap />
    </MapProvider>
  </NoSsr>
);
// eslint-disable-next-line import/no-default-export
export default Map;
