import { AbfahrtenList } from '@/client/Abfahrten/Components/AbfahrtenList';
import { Header } from '@/client/Abfahrten/Components/Header';
import { RegionalMainPage } from '@/client/Regional/Components/MainPage';
import loadable from '@loadable/component';
import type { FC } from 'react';
import { Route, Routes } from 'react-router';

const DetailsRoute = loadable(
	() => import('../Common/Components/Details/DetailsRoute'),
);

export const RegionalRoutes: FC = () => (
	<Routes>
		<Route
			path="/"
			element={
				<>
					<Header regional />
					<RegionalMainPage />
				</>
			}
		/>
		<Route
			path="/details/:train/:initialDeparture/*"
			element={<DetailsRoute urlPrefix="/regional/" />}
		/>
		<Route
			path="/details/:train"
			element={<DetailsRoute urlPrefix="/regional/" />}
		/>
		<Route
			path="/:station"
			element={
				<>
					<Header regional />
					<AbfahrtenList />
				</>
			}
		/>
	</Routes>
);
