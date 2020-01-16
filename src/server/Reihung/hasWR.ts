import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import axios from 'axios';

let WRMap: Map<string, string[]> = new Map();

export const getWRLink = (trainNumber: string, date: number) => {
  const parsedDate = format(
    utcToZonedTime(date, 'Europe/Berlin'),
    'yyyyMMddHHmm'
  );

  return `https://www.apps-bahn.de/wr/wagenreihung/1.0/${trainNumber}/${parsedDate}`;
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

  setInterval(fetchList, 4 * 60 * 1000 * 60);
}

export const hasWR = (trainNumber?: string) =>
  trainNumber ? WRMap.has(trainNumber) : false;

export const WRMapEntries = () => WRMap.entries();
