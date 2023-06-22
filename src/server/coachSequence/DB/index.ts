import {
  addUseragent,
  randomDBNavigatorUseragent,
} from '@/external/randomUseragent';
import { Cache, CacheDatabase } from '@/server/cache';
import { format } from 'date-fns';
import { logger } from '@/server/logger';
import { mapInformation } from '@/server/coachSequence/DB/DBMapping';
import { UpstreamApiRequestMetric } from '@/server/admin';
import { utcToZonedTime } from 'date-fns-tz';
import Axios from 'axios';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import type { Wagenreihung } from '@/types/reihung';

const dbCoachSequenceUrls = {
  apps: 'https://www.apps-bahn.de/wr/wagenreihung/1.0',
  noncd: 'https://ist-wr.noncd.db.de/wagenreihung/1.0',
  newApps: 'https://www.apps-bahn.de/wgr/wr',
};

type DBSourceType = 'apps' | 'noncd' | 'newApps';

const dbCoachSequenceTimeout =
  process.env.NODE_ENV === 'production' ? 4500 : 10000;

const notfoundCache = new Cache<string, boolean>(
  CacheDatabase.CoachSequenceNotfound,
  30 * 60,
);

export const getDBCoachSequenceUrl = (
  trainNumber: string,
  date: Date,
  plannedStartDate?: Date,
  trainCategory?: string,
  stopEva?: string,
  administration?: string,
  type: DBSourceType = 'noncd',
): [string, DBSourceType] => {
  if (
    plannedStartDate &&
    trainCategory &&
    stopEva &&
    administration &&
    type === 'newApps'
  ) {
    return [
      `${dbCoachSequenceUrls[type]}/${administration}/${formatPlannedDate(
        plannedStartDate,
      )}/${trainCategory}/${trainNumber}/${stopEva}/${formatDate(date)}`,
      'newApps',
    ];
  }
  return [
    `${dbCoachSequenceUrls[type]}/${trainNumber}/${formatDate(date)}`,
    type,
  ];
};

const formatDate = (date: Date) =>
  format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm');
const formatPlannedDate = (date: Date) =>
  format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMdd');

const coachSequenceCache = new Cache<string, [Wagenreihung, DBSourceType]>(
  CacheDatabase.CoachSequenceFound,
  5 * 60,
);

const navigatorAxios = Axios.create();
navigatorAxios.interceptors.request.use(
  addUseragent.bind(undefined, randomDBNavigatorUseragent),
);
async function coachSequence(
  trainNumber: string,
  date: Date,
  plannedStartDate?: Date,
  trainCategory?: string,
  stopEva?: string,
  administration?: string,
  retry = 2,
): Promise<[Wagenreihung, DBSourceType] | undefined> {
  const cacheKey = `${trainNumber}-${date}-${plannedStartDate}-${trainCategory}-${stopEva}-${administration}`;
  const isNotFound = await notfoundCache.exists(cacheKey);
  if (isNotFound) {
    return;
  }
  const cached = await coachSequenceCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  let both404 = true;
  if (plannedStartDate && trainCategory && stopEva && administration) {
    try {
      const cancelToken = new Axios.CancelToken((c) => {
        setTimeout(c, dbCoachSequenceTimeout);
      });
      const [url, type] = getDBCoachSequenceUrl(
        trainNumber,
        date,
        plannedStartDate,
        trainCategory,
        stopEva,
        administration,
        'newApps',
      );
      UpstreamApiRequestMetric.inc({
        api: `coachSequence-${type}`,
      });
      const info = (
        await navigatorAxios.get<Wagenreihung>(url, {
          cancelToken,
        })
      ).data;
      void coachSequenceCache.set(cacheKey, [info, type]);
      return [info, type];
    } catch (e) {
      both404 = both404 && Axios.isAxiosError(e) && e.response?.status === 404;
      // we just ignore it and try the next one
    }
  }
  try {
    const cancelToken = new Axios.CancelToken((c) => {
      setTimeout(c, dbCoachSequenceTimeout);
    });
    const [url, type] = getDBCoachSequenceUrl(trainNumber, date);
    UpstreamApiRequestMetric.inc({
      api: `coachSequence-${type}`,
    });
    const info = (
      await Axios.get<Wagenreihung>(url, {
        cancelToken,
      })
    ).data;
    void coachSequenceCache.set(cacheKey, [info, type]);
    return [info, type];
  } catch (e) {
    both404 = both404 && Axios.isAxiosError(e) && e.response?.status === 404;
    // we just ignore it and try the next one
  }
  logger.info(`WR failed, both404: ${both404}, retry: ${retry}`);
  if (both404) {
    void notfoundCache.set(cacheKey, true);
  } else if (retry > 0) {
    return new Promise((resolve) => setTimeout(resolve, 100)).then(() =>
      coachSequence(
        trainNumber,
        date,
        plannedStartDate,
        trainCategory,
        stopEva,
        administration,
        retry - 1,
      ),
    );
  }
}

export async function DBCoachSequence(
  trainNumber: string,
  date: Date,
  plannedStartDate?: Date,
  trainCategory?: string,
  stopEva?: string,
  administration?: string,
): Promise<CoachSequenceInformation | undefined> {
  const sequence = await coachSequence(
    trainNumber,
    date,
    plannedStartDate,
    trainCategory,
    stopEva,
    administration,
  );
  if (!sequence) return undefined;

  const mapped = mapInformation(sequence[0]);
  if (mapped) {
    mapped.source = `DB-${sequence[1]}`;
  }
  return mapped;
}
