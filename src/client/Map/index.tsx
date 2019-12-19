import { NoSsr } from '@material-ui/core';
import loadable from '@loadable/component';
import React from 'react';

const LazyTrainMap = loadable(() => import('./TrainMap'));

const Map = () => (
  <NoSsr>
    <LazyTrainMap />
  </NoSsr>
);

export default Map;
