import { AbfahrtenRoutes } from '@/client/Abfahrten/AbfahrtenRoutes';
import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { trpc } from '@/client/RPC';
import { type FC, useMemo } from 'react';
import { Header } from './Components/Header';

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
		<AbfahrtenProvider
			urlPrefix="/"
			abfahrtenFetch={trpcUtils.iris.abfahrten}
			stopPlaceApiFunction={stopPlaceApiFunction}
		>
			<Header />
			<AbfahrtenRoutes />
		</AbfahrtenProvider>
	);
};
export default Abfahrten;
