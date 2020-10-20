import { CacheDatabases, createNewCache } from 'server/cache';
import Axios from 'axios';
import cheerio from 'cheerio';

// 48 hours in seconds
const cache = createNewCache<string, string | null>(
  48 * 60 * 60,
  CacheDatabases.DBLageplan,
);

export async function getDBLageplan(
  stationName: string,
): Promise<string | undefined> {
  const cached = await getCachedDBLageplan(stationName);

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
    void cache.set(stationName, null);

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
    void cache.set(stationName, null);

    return undefined;
  }
  const pdfLink = `https://www.bahnhof.de${rawPdfLink}`;

  void cache.set(stationName, pdfLink);

  return pdfLink;
}
export function getCachedDBLageplan(
  stationName: string,
): Promise<string | null | undefined> {
  return cache.get(stationName);
}
