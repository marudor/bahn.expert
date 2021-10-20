import { format } from 'date-fns';
import { mapInformation } from 'server/coachSequence/DB/DBMapping';
import { utcToZonedTime } from 'date-fns-tz';
import Axios from 'axios';
import type { CoachSequenceInformation } from 'types/coachSequence';
import type { Wagenreihung } from 'types/reihung';

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
): string => {
  return `${dbCoachSequenceUrls[type]}/${trainNumber}/${formatDate(date)}`;
};

const formatDate = (date: Date) =>
  format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm');

async function coachSequence(trainNumber: string, date: Date) {
  if (trainNumber.length <= 4) {
    try {
      const cancelToken = new Axios.CancelToken((c) => {
        setTimeout(c, dbCoachSequenceTimeout);
      });
      const info = (
        await Axios.get<Wagenreihung>(
          getDBCoachSequenceUrl(trainNumber, date),
          {
            cancelToken,
          },
        )
      ).data;
      return info;
    } catch {
      // we just ignore it and try the next one
    }
  }
  const cancelToken = new Axios.CancelToken((c) => {
    setTimeout(c, dbCoachSequenceTimeout);
  });
  const info = (
    await Axios.get<Wagenreihung>(
      getDBCoachSequenceUrl(trainNumber, date, 'apps'),
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
): Promise<Wagenreihung> {
  try {
    return coachSequence(trainNumber, date);
  } catch (e) {
    if (Axios.isCancel(e)) {
      if (retry) return rawDBCoachSequence(trainNumber, date, retry - 1);
      throw {
        response: {
          status: 404,
          statusText: 'Timeout',
          data: 404,
        },
      };
    }

    throw {
      response: {
        status: 404,
        statusText: 'Not Found',
        data: 404,
      },
    };
  }
}

export async function DBCoachSequence(
  trainNumber: string,
  date: Date,
): Promise<CoachSequenceInformation | undefined> {
  const rawSequence = await rawDBCoachSequence(trainNumber, date);

  return mapInformation(rawSequence.data.istformation);
}
