import { FavList } from '@/client/Abfahrten/Components/FavList';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_abfahrten/')({
	component: RouteComponent,
});

function RouteComponent() {
	return <FavList mostUsed />;
}
