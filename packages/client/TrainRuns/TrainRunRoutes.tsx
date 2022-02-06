import { Route, Routes } from 'react-router';
import { TrainRunsMain } from 'client/TrainRuns/Components/TrainRunsMain';
import type { FC } from 'react';

export const TrainRunRoutes: FC = () => (
  <Routes>
    <Route path="/" element={<TrainRunsMain />} />
  </Routes>
);
