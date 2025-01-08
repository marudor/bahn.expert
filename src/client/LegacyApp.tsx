import Abfahrten from '@/client/Abfahrten';
import DetailsRoute from '@/client/Common/Components/Details/DetailsRoute';
import Routing from '@/client/Routing';
import { RoutingProvider } from '@/client/Routing/provider/RoutingProvider';
import TrainRuns from '@/client/TrainRuns';
import type { FC } from 'react';
import { Route, Routes } from 'react-router';

export const LegacyApp: FC = () => {
	return (
		<RoutingProvider>
			<Routes>
				{/* If you change this route also change hafasDetailsRedirect.ts */}
				<Route
					path="/details/:train/:initialDeparture/*"
					element={<DetailsRoute />}
				/>
				<Route path="/details/:train" element={<DetailsRoute />} />
				<Route path="/routing/*" element={<Routing />} />
				<Route path="/trainRuns/*" element={<TrainRuns />} />
				<Route path="/*" element={<Abfahrten />} />
			</Routes>
		</RoutingProvider>
	);
};
