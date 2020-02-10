import { NoSsr } from '@material-ui/core';
import loadable from '@loadable/component';
import MapContainer from 'client/Map/container/MapContainer';
import React from 'react';

const LazyTrainMap = loadable(() => import('./Components/TrainMap'));

const Map = () => (
  <NoSsr>
    <MapContainer.Provider>
      <LazyTrainMap />
    </MapContainer.Provider>
  </NoSsr>
);

export default Map;
