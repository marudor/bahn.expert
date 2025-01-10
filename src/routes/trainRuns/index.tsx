import { TrainRuns } from '@/client/TrainRuns';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trainRuns/')({
	head: () => ({
		meta: [
			{
				title: 'Zugläufe',
			},
		],
	}),
	component: TrainRuns,
});
