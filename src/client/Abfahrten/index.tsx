import { AbfahrtenRoutes } from '@/client/Abfahrten/AbfahrtenRoutes';
import { MostUsed } from '@/client/Abfahrten/Components/MostUsed';
import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { AuslastungsProvider } from '@/client/Abfahrten/provider/AuslastungsProvider';
import { trpc } from '@/client/RPC';
import { type FC, useMemo } from 'react';
import { Header } from './Components/Header';
import { FavProvider } from './provider/FavProvider';

export const Abfahrten: FC = () => {
	const trpcUtils = trpc.useUtils();
	const stopPlaceApiFunction = useMemo(
		() => (searchTerm: string) =>
			trpcUtils.stopPlace.byName.fetch({
				searchTerm,
				filterForIris: true,
				max: 1,
			}),
		[trpcUtils.stopPlace.byName],
	);

	return (
		<AuslastungsProvider>
			<AbfahrtenProvider
				urlPrefix="/"
				abfahrtenFetch={trpcUtils.iris.abfahrten}
				stopPlaceApiFunction={stopPlaceApiFunction}
			>
				<FavProvider storageKey="favs" MostUsedComponent={MostUsed}>
					<Header />
					<AbfahrtenRoutes />
				</FavProvider>
			</AbfahrtenProvider>
		</AuslastungsProvider>
	);
};
export default Abfahrten;
