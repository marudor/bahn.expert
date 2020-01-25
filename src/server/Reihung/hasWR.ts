import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
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
      tryThese.forEach(line => {
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

export const WRMapEntries = () => WRMap.entries();
