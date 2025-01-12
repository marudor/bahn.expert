import { Header } from '@/client/Routing/Components/Header';
import { RoutingConfigProvider } from '@/client/Routing/provider/RoutingConfigProvider';
import { RoutingFavProvider } from '@/client/Routing/provider/RoutingFavProvider';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { Stack } from '@mui/material';
import {
	Outlet,
	createFileRoute,
	useRouterState,
} from '@tanstack/react-router';

interface RoutingLoaderData {
	start?: MinimalStopPlace;
	destination?: MinimalStopPlace;
	via?: MinimalStopPlace[];
	date?: Date;
}

export const Route = createFileRoute('/routing')({
	component: RoutingLayout,
});

function RoutingLayout() {
	const loaderData = useRouterState({
		select: (s) =>
			s.matches.find((m) => m.loaderData)?.loaderData as
				| RoutingLoaderData
				| undefined,
	});
	return (
		<RoutingConfigProvider
			start={loaderData?.start}
			destination={loaderData?.destination}
			via={loaderData?.via}
			date={loaderData?.date}
		>
			<RoutingFavProvider>
				<Stack padding="0 .5em">
					<Header />
					<Outlet />
				</Stack>
			</RoutingFavProvider>
		</RoutingConfigProvider>
	);
}
