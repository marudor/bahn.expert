import { format } from 'date-fns';
import Axios from 'axios';
import type { OEBBInfo } from 'oebb/types/coachSequence';

const client = Axios.create({
  baseURL: 'https://live.oebb.at/backend',
});

export async function info(
  trainNumber: number,
  evaNumber: string,
  departureDate: Date,
): Promise<OEBBInfo | undefined> {
  const info = (
    await client.get<OEBBInfo>('/info', {
      params: {
        trainNr: trainNumber,
        station: evaNumber,
        date: format(departureDate, 'yyyy-MM-dd'),
      },
    })
  ).data;
  if (info.timeTableInfo.trainNr !== trainNumber) return undefined;
  return info;
}
