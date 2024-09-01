import { trpc } from '@/client/RPC';
import type { TrainInfo } from '@/types/iris';

export type FallbackTrainsForCoachSequence = Pick<
	TrainInfo,
	'admin' | 'number' | 'type'
>;

export const useCoachSequence = (
	trainNumber: number,
	currentEvaNumber: string,
	scheduledDeparture: Date,
	initialDeparture?: Date,
	fallback: FallbackTrainsForCoachSequence[] = [],
	trainCategory?: string,
	lastArrivalEva?: string,
) => {
	const baseOptions = {
		evaNumber: currentEvaNumber,
		departure: scheduledDeparture,
		initialDeparture,
		lastArrivalEva,
	};
	const mainSequence = trpc.coachSequence.sequence.useQuery({
		...baseOptions,
		trainNumber,
		category: trainCategory,
	});

	const fallbackSequences = fallback.map((f) =>
		trpc.coachSequence.sequence.useQuery({
			trainNumber: Number.parseInt(f.number),
			category: f.type,
			...baseOptions,
		}),
	);

	if (mainSequence.isFetched) {
		if (mainSequence.data) {
			return mainSequence.data;
		}
		return fallbackSequences.find((f) => f.data)?.data;
	}

	return mainSequence.data;
};
