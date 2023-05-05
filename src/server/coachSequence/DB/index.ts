import { format } from 'date-fns';
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
  process.env.NODE_ENV === 'production' ? 2500 : 10000;

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

async function coachSequence(
  trainNumber: string,
  date: Date,
  plannedStartDate?: Date,
  trainCategory?: string,
  stopEva?: string,
  administration?: string,
): Promise<[Wagenreihung, DBSourceType] | undefined> {
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
        await Axios.get<Wagenreihung>(url, {
          cancelToken,
        })
      ).data;
      return [info, type];
    } catch {
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
    return [info, type];
  } catch {
    // we just ignore it and try the next one
  }
  const cancelToken = new Axios.CancelToken((c) => {
    setTimeout(c, dbCoachSequenceTimeout);
  });
  const type = 'apps';
  UpstreamApiRequestMetric.inc({
    api: `coachSequence-${type}`,
  });
  const info = (
    await Axios.get<Wagenreihung>(
      getDBCoachSequenceUrl(
        trainNumber,
        date,
        undefined,
        undefined,
        undefined,
        undefined,
        type,
      )[0],
      {
        cancelToken,
      },
    )
  ).data;
  return [info, type];
}

export async function rawDBCoachSequence(
  trainNumber: string,
  date: Date,
  plannedStartDate?: Date,
  trainCategory?: string,
  stopEva?: string,
  administration?: string,
  retry = 2,
): Promise<[Wagenreihung, DBSourceType] | undefined> {
  try {
    return await coachSequence(
      trainNumber,
      date,
      plannedStartDate,
      trainCategory,
      stopEva,
      administration,
    );
  } catch (error) {
    if (Axios.isCancel(error) && retry)
      return rawDBCoachSequence(
        trainNumber,
        date,
        plannedStartDate,
        trainCategory,
        stopEva,
        administration,
        retry - 1,
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
  const sequence = await rawDBCoachSequence(
    trainNumber,
    date,
    plannedStartDate,
    trainCategory,
    stopEva,
    administration,
  );
  if (!sequence) return undefined;

  const mapped = mapInformation(sequence[0].data.istformation);
  if (mapped) {
    mapped.source = `DB-${sequence[1]}`;
  }
  return mapped;
}
