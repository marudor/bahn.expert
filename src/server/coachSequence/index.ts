import { DBCoachSequence } from '@/server/coachSequence/DB';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import type { EvaNumber } from '@/types/common';
import {
	addDays,
	differenceInHours,
	isWithinInterval,
	subDays,
} from 'date-fns';

export async function coachSequence(
	trainNumber: string,
	departure: Date,
	evaNumber?: EvaNumber,
	initialDeparture?: Date,
	trainCategory?: string,
	administration?: string,
): Promise<CoachSequenceInformation | undefined> {
	if (
		!isWithinInterval(departure, {
			start: subDays(new Date(), 1),
			end: addDays(new Date(), 1),
		})
	) {
		return;
	}

	// no need to check for stuff more than 24 hours in the future, we dont have that
	if (differenceInHours(departure, new Date()) >= 24) {
		return undefined;
	}

	return await DBCoachSequence(
		trainNumber,
		departure,
		initialDeparture,
		trainCategory,
		evaNumber,
		administration,
	);
}
