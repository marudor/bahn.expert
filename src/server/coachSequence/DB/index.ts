import { isWithin20Hours } from '@/external/risTransports/config';
import { Cache, CacheDatabase } from '@/server/cache';
import { getNewDBCoachSequence } from '@/server/coachSequence/DB/bahnDe';
import { getRisTransportsCoachSequence } from '@/server/coachSequence/DB/risTransports';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import { format } from 'date-fns';

const formatDate = (date?: Date) =>
	date ? format(date, 'yyyyMMddHHmm') : undefined;
// const formatPlannedDate = (date?: Date) =>
//   date ? format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMdd') : undefined;

const coachSequenceCache = new Cache<CoachSequenceInformation>(
	CacheDatabase.ParsedCoachSequenceFound,
);

export async function DBCoachSequence(
	trainNumber: string,
	date: Date,
	plannedStartDate?: Date,
	trainCategory?: string,
	stopEva?: string,
	administration?: string,
): Promise<CoachSequenceInformation | undefined> {
	if (!isWithin20Hours(date)) {
		return undefined;
	}

	const formattedDate = formatDate(date);

	const cacheKey = `${trainNumber}-${formattedDate}-${trainCategory}-${stopEva}`;
	const cached = await coachSequenceCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	if (plannedStartDate && trainCategory && stopEva) {
		const risTransportsSequence = await getRisTransportsCoachSequence(
			trainCategory,
			trainNumber,
			stopEva,
			date,
			plannedStartDate,
			administration,
		);
		// hacky way for administration skip
		if (risTransportsSequence === null) {
			return;
		}
		if (risTransportsSequence) {
			void coachSequenceCache.set(cacheKey, risTransportsSequence);
			return risTransportsSequence;
		}

		// ris not found, lets try bahn.de - should never find something though

		const newDbSequence = await getNewDBCoachSequence(
			trainCategory,
			trainNumber,
			stopEva,
			date,
			plannedStartDate,
		);
		if (newDbSequence) {
			void coachSequenceCache.set(cacheKey, newDbSequence);
			return newDbSequence;
		}
	}
}
