import Abfahrten from '@/client/Abfahrten';
import DetailsRoute from '@/client/Common/Components/Details/DetailsRoute';
import { RoutingProvider } from '@/client/Routing/provider/RoutingProvider';
import type { FC } from 'react';
import { Route, Routes } from 'react-router';

export const LegacyApp: FC = () => {
	return (
		<RoutingProvider>
			<Routes>
				<Route
					path="/details/:train/:initialDeparture/*"
					element={<DetailsRoute />}
				/>
				<Route path="/details/:train" element={<DetailsRoute />} />
				{/* <Route path="/trainRuns/*" element={<TrainRuns />} /> */}
				<Route path="/*" element={<Abfahrten />} />
			</Routes>
		</RoutingProvider>
	);
};
