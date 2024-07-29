import { Header } from '@/client/TrainRuns/Components/Header';
import { TrainRunRoutes } from '@/client/TrainRuns/TrainRunRoutes';
import { TrainRunProvider } from '@/client/TrainRuns/provider/TrainRunProvider';
import { styled } from '@mui/material';
import type { FC } from 'react';

const Container = styled('main')`
  height: 100%;
`;

export const TrainRuns: FC = () => (
	<TrainRunProvider>
		<Header />
		<Container>
			<TrainRunRoutes />
		</Container>
	</TrainRunProvider>
);

export default TrainRuns;
