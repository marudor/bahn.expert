import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { FavProvider } from '@/client/Abfahrten/provider/FavProvider';
import { trpc } from '@/client/RPC';
import { RegionalRoutes } from '@/client/Regional/RegionalRoutes';
import { type FC, useMemo } from 'react';

export const Regional: FC = () => {
	const trpcUtils = trpc.useUtils();
	const stopPlaceApiFunction = useMemo(
		() => (searchTerm: string) =>
			trpcUtils.stopPlace.byName.fetch({
				searchTerm,
				max: 1,
			}),
		[trpcUtils.stopPlace.byName],
	);
	return (
		<AbfahrtenProvider
			urlPrefix="/regional/"
			abfahrtenFetch={trpcUtils.hafas.irisAbfahrten}
			stopPlaceApiFunction={stopPlaceApiFunction}
		>
			<FavProvider storageKey="regionalFavs">
				<RegionalRoutes />
			</FavProvider>
		</AbfahrtenProvider>
	);
};
export default Regional;
