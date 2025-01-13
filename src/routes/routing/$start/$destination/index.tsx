import { Routing } from '@/client/Routing';
import { routingLoader } from '@/routes/routing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/routing/$start/$destination/')({
	loader: routingLoader,
	component: Routing,
});
