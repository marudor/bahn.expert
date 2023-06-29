import { format } from 'date-fns';
import Axios from 'axios';
import https from 'node:https';
import type { OEBBInfo } from '@/oebb/types/coachSequence';

const client = Axios.create({
  baseURL: 'https://live.oebb.at/backend',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
    // This allows connection to CVE-2009-3555 vulnerable servers. You shouldn't do that usually. idc here, I want coachSequences.
    secureOptions: 0x4,
  }),
  timeout: 10000,
});

export async function info(
  trainNumber: number,
  evaNumber: string,
  departureDate: Date,
): Promise<OEBBInfo | undefined> {
  try {
    const req = await client.get<OEBBInfo>('/info', {
      params: {
        trainNr: trainNumber,
        station: evaNumber,
        date: format(departureDate, 'yyyy-MM-dd'),
      },
    });
    const info = req.data;
    if (info.timeTableInfo.trainNr !== trainNumber) return undefined;
    return info;
  } catch {
    return undefined;
  }
}
