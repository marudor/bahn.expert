import type { FC } from 'react';
import { Route, Routes } from 'react-router';
import { AbfahrtenList } from './Components/AbfahrtenList';
import { FavList } from './Components/FavList';

export const AbfahrtenRoutes: FC = () => (
	<Routes>
		<Route path="/" element={<FavList favKey="favs" mostUsed />} />
		<Route path="/:station/*" element={<AbfahrtenList />} />
	</Routes>
);
