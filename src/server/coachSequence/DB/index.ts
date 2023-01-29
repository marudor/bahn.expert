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
};

const dbCoachSequenceTimeout =
  process.env.NODE_ENV === 'production' ? 2500 : 10000;

export const getDBCoachSequenceUrl = (
  trainNumber: string,
  date: Date,
  type: 'apps' | 'noncd' = 'noncd',
): [string, 'apps' | 'noncd'] => {
  return [
    `${dbCoachSequenceUrls[type]}/${trainNumber}/${formatDate(date)}`,
    type,
  ];
};

const formatDate = (date: Date) =>
  format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm');

async function coachSequence(trainNumber: string, date: Date) {
  if (trainNumber.length <= 4) {
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
      return info;
    } catch {
      // we just ignore it and try the next one
    }
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
      getDBCoachSequenceUrl(trainNumber, date, type)[0],
      {
        cancelToken,
      },
    )
  ).data;
  return info;
}

export async function rawDBCoachSequence(
  trainNumber: string,
  date: Date,
  retry = 2,
): Promise<Wagenreihung | undefined> {
  try {
    return await coachSequence(trainNumber, date);
  } catch (error) {
    if (Axios.isCancel(error) && retry)
      return rawDBCoachSequence(trainNumber, date, retry - 1);
  }
}

export async function DBCoachSequence(
  trainNumber: string,
  date: Date,
): Promise<CoachSequenceInformation | undefined> {
  const rawSequence = await rawDBCoachSequence(trainNumber, date);
  if (!rawSequence) return undefined;

  return mapInformation(rawSequence.data.istformation);
}
