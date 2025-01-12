import { Header } from '@/client/Abfahrten/Components/Header';
import { AbfahrtenProvider } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_abfahrten')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<AbfahrtenProvider>
			<Header />
			<Outlet />
		</AbfahrtenProvider>
	);
}
