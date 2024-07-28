import { AbfahrtenRoutes } from '@/client/Abfahrten/AbfahrtenRoutes';
import { MostUsed } from '@/client/Abfahrten/Components/MostUsed';
import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { AuslastungsProvider } from '@/client/Abfahrten/provider/AuslastungsProvider';
import { MainWrap } from '@/client/Common/Components/MainWrap';
import { getStopPlacesFromAPI } from '@/client/Common/service/stopPlaceSearch';
import type { FC } from 'react';
import { Header } from './Components/Header';
import { FavProvider } from './provider/FavProvider';

const stopPlaceApiFunction = getStopPlacesFromAPI.bind(
	undefined,
	true,
	1,
	undefined,
);

export const Abfahrten: FC = () => {
	return (
		<AuslastungsProvider>
			<AbfahrtenProvider
				urlPrefix="/"
				fetchApiUrl="/api/iris/v2/abfahrten"
				stopPlaceApiFunction={stopPlaceApiFunction}
			>
				<FavProvider storageKey="favs" MostUsedComponent={MostUsed}>
					<MainWrap>
						<Header />
						<AbfahrtenRoutes />
					</MainWrap>
				</FavProvider>
			</AbfahrtenProvider>
		</AuslastungsProvider>
	);
};
export default Abfahrten;
