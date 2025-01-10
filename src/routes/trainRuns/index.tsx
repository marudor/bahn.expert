import { TrainRuns } from '@/client/TrainRuns';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/trainRuns/')({
	component: TrainRuns,
});
