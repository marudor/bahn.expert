import { CacheDatabases, createNewCache } from 'server/cache';
import { format, parse } from 'date-fns';
import { logger } from 'server/logger';
import { utcToZonedTime } from 'date-fns-tz';
import { wagenreihung } from 'server/Reihung';
import axios from 'axios';

export const WRCache = createNewCache<string, string[] | null>(
  3 * 60 * 60,
  CacheDatabases.CouchSequence
);

const formatDate = (date: number) =>
  format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm');

export const getWRLink = (trainNumber: string, date: number) => {
  return `https://www.apps-bahn.de/wr/wagenreihung/1.0/${trainNumber}/${formatDate(
    date
  )}`;
};

async function fetchList() {
  logger.debug('Fetching Couch Sequence');
  try {
    await axios.get(getWRLink('1', Date.now()));
  } catch (e) {
    const tryThese = e.response?.data?.tryThese;

    if (tryThese && Array.isArray(tryThese)) {
      const WRMap = new Map<string, string[]>();

      tryThese.forEach(async (line) => {
        const [, number, time] = line.split('/');
        let entriesForNumber = WRMap.get(number);

        if (!entriesForNumber) {
          entriesForNumber = [];
        }
        entriesForNumber.push(time);
        entriesForNumber.sort();
        WRMap.set(number, entriesForNumber);
      });
      await WRCache.reset();

      for (const [number, entries] of WRMap.entries()) {
        WRCache.set(number, entries);
      }
    }
    logger.debug('Fetched Couch Sequence');
  }
}

if (process.env.NODE_ENV !== 'test') {
  fetchList();

  setInterval(fetchList, 2 * 60 * 1000 * 60);
}

export const hasWR = async (trainNumber?: string, date?: number) => {
  if (!trainNumber) return false;
  const WRDates = await WRCache.get(trainNumber);

  return date ? WRDates?.includes(formatDate(date)) : Boolean(WRDates);
};

/**
 *
 * @param TZNumber only the number
 */
export const WRForTZ = async (TZNumber: string) => {
  const keys = await WRCache.keys();
  const timesArray = await WRCache.mget(keys);

  for (let i = 0; i < keys.length; i += 1) {
    const number = keys[i];
    const times = timesArray[i];

    // eslint-disable-next-line no-continue
    if (number.length > 4 || !times) continue;
    const parsedNumber = Number.parseInt(number, 10);

    // eslint-disable-next-line no-continue
    if (parsedNumber > 3000 && parsedNumber < 9000) continue;
    try {
      // eslint-disable-next-line no-console
      console.log(`Check if ${TZNumber} is today ${number}`);
      // eslint-disable-next-line no-await-in-loop
      const WR = await wagenreihung(
        number,
        parse(times[0], 'yyyyMMddHHmm', Date.now()).getTime()
      );

      if (WR.allFahrzeuggruppe.some((g) => g.tzn === TZNumber)) {
        // eslint-disable-next-line no-console
        console.log(`TZ ${TZNumber} today as ${number}`);

        return WR;
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }
};

export const WRForNumber = async (trainNumber: string) => {
  const WRDates = await WRCache.get(trainNumber);

  if (!WRDates) return;

  const wr = await wagenreihung(
    trainNumber,
    parse(WRDates[0], 'yyyyMMddHHmm', Date.now()).getTime()
  );

  return wr;
};
