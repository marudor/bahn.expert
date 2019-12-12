import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import axios from 'axios';

let WRList: string[] = [];

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

    if (tryThese && Array.isArray(tryThese)) {
      WRList = tryThese.map(string => string.split('/')[1]);
      // eslint-disable-next-line no-console
      console.log('Fetched WRList');
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  fetchList();

  setInterval(fetchList, 4 * 60 * 1000 * 60);
}

export const hasWR = (trainNumber?: string) =>
  trainNumber ? WRList.includes(trainNumber) : false;
