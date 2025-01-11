import { Routing } from '@/client/Routing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
	'/routing/$start/$destination/$date/$via/',
)({
	component: Routing,
});