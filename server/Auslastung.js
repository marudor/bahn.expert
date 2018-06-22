// @flow
import { DateTime } from 'luxon';
import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';

const cache = new Map();
let lastUpdateCache;

const updatedRegex = /\d\d?\.\d\d\.\d\d\d\d \d\d:\d\d/;

function getLastUpdated($) {
  const lastUpdateText = $('p.blockquote-footer > small').text();

  if (lastUpdateText) {
    const timeString = updatedRegex.exec(lastUpdateText)[0];

    return DateTime.fromFormat(timeString, 'dd.MM.yyyy HH:mm');
  }

  return null;
}

export default function createAuslastungsFunction(username: string, password: string) {
  return async function zugAuslastung(trainId: number, date: string) {
    const html = (await axios.post(
      'https://services.cio-fernverkehr.de/ar/',
      qs.stringify({
        // modus: 'znr_suche',
        todo: 'suchen',
        rdate: date,
        znr: trainId,
      }),
      {
        responseType: 'text',
        auth: {
          username,
          password,
        },
      }
    )).data;

    const $ = cheerio.load(html);

    const lastUpdate = getLastUpdated($);

    if (lastUpdate) {
      if (lastUpdate === lastUpdateCache) {
        const cached = cache.get(`${trainId}${date}`);

        if (cached) {
          return cached;
        }
      } else {
        lastUpdateCache = lastUpdate;
      }
    }

    const entries = $('#tab_laufweg tbody > tr').toArray();

    const data = entries.map(e => {
      const columns = $(e).children('td');

      const time = $(columns[1]).text();

      const stops = $(columns[2]).text();
      const [start, stop] = stops.split(' - ');

      const firstColumn = $(columns[3]).children();
      const secondColumn = $(columns[4]).children();

      // eslint-disable-next-line no-nested-ternary
      const first = firstColumn.hasClass('badge-danger') ? 2 : firstColumn.hasClass('badge-warning') ? 1 : 0;
      // eslint-disable-next-line no-nested-ternary
      const second = secondColumn.hasClass('badge-danger') ? 2 : secondColumn.hasClass('badge-warning') ? 1 : 0;

      return { time, start, stop, first, second };
    });

    const result = {
      lastUpdate,
      data,
    };

    cache.set(`${trainId}${date}`, result);

    return result;
  };
}
