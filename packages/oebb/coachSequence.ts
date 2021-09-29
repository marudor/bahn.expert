import { format } from 'date-fns';
import Axios from 'axios';
import type { OEBBCoachSequence } from 'oebb/types/coachSequence';

const client = Axios.create({
  baseURL: 'https://live.oebb.at/backend/api/train',
});

export async function coachSequence(
  trainName: string,
  evaNumber: string,
  departureDate: Date,
): Promise<OEBBCoachSequence> {
  console.log(
    `/${trainName}/stationEva/${evaNumber}/departure/${format(
      departureDate,
      'dd.MM.yyyy',
    )}`,
  );
  return await (
    await client.get(
      `/${trainName}/stationEva/${evaNumber}/departure/${format(
        departureDate,
        'dd.MM.yyyy',
      )}`,
    )
  ).data;
}
