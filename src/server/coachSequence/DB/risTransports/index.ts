import { getDepartureSequence } from '@/external/risTransports/sequence';
import { mapInformation } from '@/server/coachSequence/DB/risTransports/mapping';
import { logger } from '@/server/logger';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import {} from 'date-fns';

export async function getRisTransportsCoachSequence(
	trainCategory: string,
	trainNumber: string,
	evaNumber: string,
	plannedDepartureDate: Date,
	initialDepartureDate: Date,
	administration?: string,
): Promise<CoachSequenceInformation | undefined | null> {
	try {
		const sequence = await getDepartureSequence(
			trainCategory,
			Number.parseInt(trainNumber),
			evaNumber,
			plannedDepartureDate,
			initialDepartureDate,
			administration,
		);

		const mappedSequence = await mapInformation(
			sequence,
			trainCategory,
			trainNumber,
			evaNumber,
		);
		return mappedSequence;
	} catch (e) {
		logger.error(e, 'failed risTransports Sequence');
		// fallback on error
		return undefined;
	}
}
