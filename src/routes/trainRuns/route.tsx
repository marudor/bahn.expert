import { Header } from '@/client/TrainRuns/Components/Header';
import { TrainRunProvider } from '@/client/TrainRuns/provider/TrainRunProvider';
import { styled } from '@mui/material';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trainRuns')({
	component: RouteComponent,
});

const Container = styled('main')`
  height: 100%;
`;

function RouteComponent() {
	return (
		<TrainRunProvider>
			<Header />
			<Container>
				<Outlet />
			</Container>
		</TrainRunProvider>
	);
}
