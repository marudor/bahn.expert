import { TrainRunsMain } from '@/client/TrainRuns/Components/TrainRunsMain';
import type { FC } from 'react';
import { Route, Routes } from 'react-router';

export const TrainRunRoutes: FC = () => (
	<Routes>
		<Route path="/" element={<TrainRunsMain />} />
	</Routes>
);
