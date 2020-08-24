import { CacheDatabases, createNewCache } from 'server/cache';
import Axios from 'axios';
import cheerio from 'cheerio';

// 12 hours in seconds
export const cache = createNewCache<string, string | null>(
  12 * 60 * 60,
  CacheDatabases.Lageplan,
);

export async function getLageplan(stationName: string) {
  const cached = await getCachedLageplan(stationName);

  if (cached) return cached;
  // undefined = haven't tried yet
  // null = already tried to fetch, but nothing found
  if (cached === null) return undefined;
  const searchHtml = (
    await Axios.get<string>(
      `https://www.bahnhof.de/service/search/bahnhof-de/520608`,
      {
        params: {
          query: stationName,
        },
      },
    )
  ).data;

  let $ = cheerio.load(searchHtml);
  const firstResultLink = $('#result .title > a').first().attr('href');

  if (!firstResultLink) {
    cache.set(stationName, null);

    return undefined;
  }

  const bahnhofHtml = (
    await Axios.get<string>(`https://www.bahnhof.de${firstResultLink}`)
  ).data;

  $ = cheerio.load(bahnhofHtml);
  const rawPdfLink = $('.bahnhof > .embeddedDownload > .download-asset > a')
    .first()
    .attr('href');

  if (!rawPdfLink) {
    cache.set(stationName, null);

    return undefined;
  }
  const pdfLink = `https://www.bahnhof.de${rawPdfLink}`;

  cache.set(stationName, pdfLink);

  return pdfLink;
}
export function getCachedLageplan(stationName: string) {
  return cache.get(stationName);
}
