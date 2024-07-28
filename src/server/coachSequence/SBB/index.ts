import { UpstreamApiRequestMetric } from '@/server/admin';
import { mapSBBCoachSequence } from '@/server/coachSequence/SBB/SBBMapping';
import { fetchSBBCoachSequence } from '@/server/sbb/coachSequence';
import type { CoachSequenceInformation } from '@/types/coachSequence';

export async function SBBCoachSequence(
	evaNumber: string,
	trainNumber: string,
	departureTime: Date,
	lastArrivalEva: string,
): Promise<CoachSequenceInformation | undefined> {
	UpstreamApiRequestMetric.inc({
		api: 'coachSequence-SBB',
	});

	const rawSequence = await fetchSBBCoachSequence(
		evaNumber,
		trainNumber,
		departureTime,
		lastArrivalEva,
	);

	return mapSBBCoachSequence(rawSequence);
}
