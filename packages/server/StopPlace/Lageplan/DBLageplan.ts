import * as cheerio from 'cheerio';
import { CacheDatabases, createNewCache } from 'server/cache';
import Axios from 'axios';

// 48 hours in seconds
const cache = createNewCache<string, string | null>(
  48 * 60 * 60,
  CacheDatabases.DBLageplan,
);

export async function getDBLageplan(
  stationName: string,
): Promise<string | undefined> {
  try {
    const cached = await getCachedDBLageplan(stationName);

    if (cached) return cached;
    // undefined = haven't tried yet
    // null = already tried to fetch, but nothing found
    if (cached === null) return undefined;
    const searchHtml = (
      await Axios.get<string>(
        `https://www.bahnhof.de/service/search/bahnhof-de/3464932`,
        {
          params: {
            query: stationName,
          },
        },
      )
    ).data;

    let $ = cheerio.load(searchHtml);
    const firstResultLink = [...$('#result .title > a')]
      .map((node) => node.attribs['href'])
      .filter(Boolean)
      .find((href) => href.startsWith('/bahnhof'));

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
  } catch {
    return undefined;
  }
}
export function getCachedDBLageplan(
  stationName: string,
): Promise<string | null | undefined> {
  return cache.get(stationName);
}
