import { Header } from '@/client/Abfahrten/Components/Header';
import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { trpc } from '@/client/RPC';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_abfahrten')({
	component: RouteComponent,
});

function RouteComponent() {
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
			abfahrtenFetch={trpcUtils.iris.abfahrten}
			stopPlaceApiFunction={stopPlaceApiFunction}
		>
			<Header />
			<Outlet />
		</AbfahrtenProvider>
	);
}
