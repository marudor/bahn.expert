import { Header } from '@/client/Routing/Components/Header';
import { RoutingConfigProvider } from '@/client/Routing/provider/RoutingConfigProvider';
import { RoutingFavProvider } from '@/client/Routing/provider/RoutingFavProvider';
import { Stack } from '@mui/material';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/routing')({
	component: RoutingLayout,
});

function RoutingLayout() {
	return (
		<RoutingConfigProvider>
			<RoutingFavProvider>
				<Stack padding="0 .5em">
					<Header />
					<Outlet />
				</Stack>
			</RoutingFavProvider>
		</RoutingConfigProvider>
	);
}
