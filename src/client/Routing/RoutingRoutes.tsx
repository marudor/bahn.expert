import { RoutesMain } from '@/client/Routing/Components/RoutesMain';
import type { FC } from 'react';
import { Route, Routes } from 'react-router';

export const RoutingRoutes: FC = () => (
	<Routes>
		<Route path="/:start/:destination/:date/:via/*" element={<RoutesMain />} />
		<Route path="/:start/:destination/:date" element={<RoutesMain />} />
		<Route path="/:start/:destination" element={<RoutesMain />} />
		<Route path="/:start" element={<RoutesMain />} />
		<Route path="/" element={<RoutesMain />} />
	</Routes>
);
