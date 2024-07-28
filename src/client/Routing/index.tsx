import { RoutingRoutes } from '@/client/Routing/RoutingRoutes';
import { RoutingConfigProvider } from '@/client/Routing/provider/RoutingConfigProvider';
import { RoutingFavProvider } from '@/client/Routing/provider/RoutingFavProvider';
import { Stack } from '@mui/material';
import type { FC } from 'react';
import { Header } from './Components/Header';

export const Routing: FC = () => (
	<RoutingConfigProvider>
		<RoutingFavProvider>
			<Stack padding="0 .5em">
				<Header />
				<RoutingRoutes />
			</Stack>
		</RoutingFavProvider>
	</RoutingConfigProvider>
);
export default Routing;
