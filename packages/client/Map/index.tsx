import { MapContainer } from 'client/Map/container/MapContainer';
import { NoSsr } from '@material-ui/core';
import loadable from '@loadable/component';

const LazyTrainMap = loadable(() => import('./Components/TrainMap'));

export const Map = () => (
  <NoSsr>
    <MapContainer.Provider>
      <LazyTrainMap />
    </MapContainer.Provider>
  </NoSsr>
);
// eslint-disable-next-line import/no-default-export
export default Map;
