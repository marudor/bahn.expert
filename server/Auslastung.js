// @flow
import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';
import NodeCache from 'node-cache';

// 15 Minutes in seconds
const stdTTL = 15 * 60;
const cache: NodeCache<
  number,
  {
    data: Object,
  }
> = new NodeCache({ stdTTL });

function mapStop(stop) {
  switch (stop) {
    case 'Berlin Hbf (tief)':
      return 'Berlin Hauptbahnhof';
    default:
      return stop;
  }
}

function mapStops(stops) {
  return stops.map(mapStop);
}

export default function createAuslastungsFunction(username: string, password: string) {
  return async function zugAuslastung(trainId: number, date: string) {
    const cached = cache.get(trainId);
    if (cached) {
      return cached;
    }
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

    const entries = $('#tab_laufweg tbody > tr').toArray();

    const data = entries.map(e => {
      const columns = $(e).children('td');

      const time = $(columns[1]).text();

      const stops = $(columns[2]).text();
      const [start, stop] = mapStops(stops.split(' - '));

      const firstColumn = $(columns[3]).children();
      const secondColumn = $(columns[4]).children();

      // eslint-disable-next-line no-nested-ternary
      const first = firstColumn.hasClass('badge-danger') ? 2 : firstColumn.hasClass('badge-warning') ? 1 : 0;
      // eslint-disable-next-line no-nested-ternary
      const second = secondColumn.hasClass('badge-danger') ? 2 : secondColumn.hasClass('badge-warning') ? 1 : 0;

      return { time, start, stop, first, second };
    });

    const result = {
      data,
    };

    cache.set(trainId, result);

    return result;
  };
}
