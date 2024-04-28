import {
  addUseragent,
  randomBahnhofLiveUseragent,
} from '@/external/randomUseragent';
import { mapInformation } from '@/server/coachSequence/DB/bahnhofLive/mapping';
import { UpstreamApiRequestMetric } from '@/server/admin';
import Axios from 'axios';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import type { Wagenreihung } from '@/types/reihung';

const dbCoachSequenceTimeout =
  process.env.NODE_ENV === 'production' ? 4500 : 10000;

const bahnhofLiveAxios = Axios.create({
  timeout: dbCoachSequenceTimeout,
});
bahnhofLiveAxios.interceptors.request.use(
  addUseragent.bind(undefined, randomBahnhofLiveUseragent),
);
export async function getBahnhofLiveSequence(
  trainNumber: string,
  formattedDate?: string,
): Promise<CoachSequenceInformation | undefined> {
  try {
    UpstreamApiRequestMetric.inc({
      api: `coachSequence-noncd`,
    });
    const sequence = (
      await bahnhofLiveAxios.get<Wagenreihung>(
        `https://ist-wr.noncd.db.de/wagenreihung/1.0/${trainNumber}/${formattedDate}`,
      )
    ).data;

    return mapInformation(sequence);
  } catch {
    // we just ignore it and try the next one
  }
}
