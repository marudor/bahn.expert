import { isWithin20Hours } from '@/external/coachSequence';
import { Cache, CacheDatabase } from '@/server/cache';
import { getNewDBCoachSequence } from '@/server/coachSequence/DB/bahnDe';
import { getBahnhofLiveSequence } from '@/server/coachSequence/DB/bahnhofLive';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const formatDate = (date?: Date) =>
	date ? format(toZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm') : undefined;
// const formatPlannedDate = (date?: Date) =>
//   date ? format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMdd') : undefined;

const coachSequenceCache = new Cache<CoachSequenceInformation>(
	CacheDatabase.ParsedCoachSequenceFound,
);

const blockedCategories = new Set(['TRAM', 'STR', 'BUS', 'BSV', 'FLUG']);

export async function DBCoachSequence(
	trainNumber: string,
	date: Date,
	plannedStartDate?: Date,
	trainCategory?: string,
	stopEva?: string,
): Promise<CoachSequenceInformation | undefined> {
	if (trainCategory && blockedCategories.has(trainCategory)) {
		return undefined;
	}
	if (!isWithin20Hours(date)) {
		return undefined;
	}

	const formattedDate = formatDate(date);

	const cacheKey = `${trainNumber}-${formattedDate}-${trainCategory}-${stopEva}`;
	const cached = await coachSequenceCache.get(cacheKey);
	if (cached) {
		return cached;
	}

	const bahnhofLiveSequence = await getBahnhofLiveSequence(
		trainNumber,
		formattedDate,
	);
	if (bahnhofLiveSequence) {
		void coachSequenceCache.set(cacheKey, bahnhofLiveSequence);
		return bahnhofLiveSequence;
	}

	if (plannedStartDate && trainCategory && stopEva) {
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
