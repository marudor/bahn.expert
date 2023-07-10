import { Temporal } from '@js-temporal/polyfill';
import Axios from 'axios';

let lines: Record<string, string> = {};

const lineMappingAxios = Axios.create({
  baseURL: process.env.PRIVATE_API_URL,
  headers: {
    'x-api-key': process.env.PRIVATE_API_KEY || '',
  },
});

async function fetchLineMapping() {
  try {
    lines = (
      await lineMappingAxios.get<Record<string, string>>(
        '/plannedSequence/v1/numberLineMapping',
      )
    ).data;
  } catch {
    // ignore we just try again
  }
}

if (process.env.NODE_ENV !== 'test') {
  void fetchLineMapping();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(
    fetchLineMapping,
    Temporal.Duration.from('PT20M').total('millisecond'),
  );
}

export function getLineFromNumber(journeyNumber?: string): string | undefined {
  if (!journeyNumber) return undefined;
  return lines[journeyNumber];
}
