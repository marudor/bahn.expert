import { format, parse } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { wagenreihung } from 'server/Reihung';
import axios from 'axios';

let WRMap: Map<string, string[]> = new Map();

const formatDate = (date: number) =>
  format(utcToZonedTime(date, 'Europe/Berlin'), 'yyyyMMddHHmm');

export const getWRLink = (trainNumber: string, date: number) => {
  return `https://www.apps-bahn.de/wr/wagenreihung/1.0/${trainNumber}/${formatDate(
    date
  )}`;
};

async function fetchList() {
  try {
    await axios.get(getWRLink('1', Date.now()));
  } catch (e) {
    const tryThese = e.response?.data?.tryThese;

    const newWRMap: Map<string, string[]> = new Map();

    if (tryThese && Array.isArray(tryThese)) {
      tryThese.forEach((line) => {
        const [, number, time] = line.split('/');
        let entriesForNumber = newWRMap.get(number);

        if (!entriesForNumber) {
          entriesForNumber = [];
        }
        entriesForNumber.push(time);
        newWRMap.set(number, entriesForNumber);
      });
      WRMap = newWRMap;
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  fetchList();

  setInterval(fetchList, 2 * 60 * 1000 * 60);
}

export const hasWR = (trainNumber?: string, date?: number) => {
  if (WRMap.size <= 0) return undefined;
  if (!trainNumber) return false;
  const WRDates = WRMap.get(trainNumber);

  return date ? WRDates?.includes(formatDate(date)) : Boolean(WRDates);
};

/**
 *
 * @param TZNumber only the number
 */
export const WRForTZ = async (TZNumber: string) => {
  for (const [number, times] of WRMap.entries()) {
    // eslint-disable-next-line no-continue
    if (number.length > 4) continue;
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
  const WRDates = WRMap.get(trainNumber);

  if (!WRDates) return;

  const wr = await wagenreihung(
    trainNumber,
    parse(WRDates[0], 'yyyyMMddHHmm', Date.now()).getTime()
  );

  return wr;
};
