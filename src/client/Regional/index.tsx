import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { AuslastungsProvider } from '@/client/Abfahrten/provider/AuslastungsProvider';
import { FavProvider } from '@/client/Abfahrten/provider/FavProvider';
import { MainWrap } from '@/client/Common/Components/MainWrap';
import { getStopPlacesFromAPI } from '@/client/Common/service/stopPlaceSearch';
import { RegionalRoutes } from '@/client/Regional/RegionalRoutes';
import type { FC } from 'react';

const regionalStopPlaceApiFunction = getStopPlacesFromAPI.bind(
	undefined,
	false,
	7,
	true,
);

export const Regional: FC = () => {
	return (
		<AuslastungsProvider>
			<AbfahrtenProvider
				urlPrefix="/regional/"
				fetchApiUrl="/api/hafas/v3/irisCompatibleAbfahrten"
				stopPlaceApiFunction={regionalStopPlaceApiFunction}
			>
				<FavProvider storageKey="regionalFavs">
					<MainWrap>
						<RegionalRoutes />
					</MainWrap>
				</FavProvider>
			</AbfahrtenProvider>
		</AuslastungsProvider>
	);
};
export default Regional;
