import { AbfahrtenList } from '@/client/Abfahrten/Components/AbfahrtenList';
import { Header } from '@/client/Abfahrten/Components/Header';
import DetailsRoute from '@/client/Common/Components/Details/DetailsRoute';
import { RegionalMainPage } from '@/client/Regional/Components/MainPage';
import type { FC } from 'react';
import { Route, Routes } from 'react-router';

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
