import { About } from '@/client/Common/Components/About';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
	component: About,
});
