import { Cache, CacheDatabase } from '@/server/cache';
import { format } from 'date-fns';
import { getBahnhofLiveSequence } from '@/server/coachSequence/DB/bahnhofLive';
import { getNewDBCoachSequence } from '@/server/coachSequence/DB/bahnDe';
import { isWithin20Hours } from '@/external/coachSequence';
import { utcToZonedTime } from 'date-fns-tz';
import type { CoachSequenceInformation } from '@/types/coachSequence';

const formatDate = (date?: Date) =>
  date
    ? format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm')
    : undefined;
const formatPlannedDate = (date?: Date) =>
  date ? format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMdd') : undefined;

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

  const cacheKey = `${trainNumber}-${formattedDate}-${formatPlannedDate(
    plannedStartDate,
  )}-${trainCategory}-${stopEva}`;
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
