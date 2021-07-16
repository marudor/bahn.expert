import { CacheDatabases, createNewCache } from 'server/cache';
import Axios from 'axios';
import cheerio from 'cheerio';

// 48 hours in seconds
const cache = createNewCache<string, string | null>(
  48 * 60 * 60,
  CacheDatabases.HVVLageplan,
);

export async function getHVVLageplan(
  evaId: string,
): Promise<string | undefined> {
  const cached = await getCachedHVVLageplan(evaId);
  if (cached) return cached;
  if (cached === null) return undefined;

  const searchHtml = (
    await Axios.get<string>(
      `https://geofox.hvv.de/jsf/showMobiInformation.seam?id=DB-EFZ_${evaId}`,
    )
  ).data;

  const $ = cheerio.load(searchHtml);
  const possibleLinks = $('#stationDescription li > a')
    .toArray()
    .map((e) => e.attribs.href);
  const actualLink = possibleLinks.find((l) => l.endsWith('.pdf'));
  if (actualLink) {
    const fullLink = `https://geofox.hvv.de${actualLink}`;
    void cache.set(evaId, fullLink);
    return fullLink;
  }
  void cache.set(evaId, null);
  return undefined;
}

export function getCachedHVVLageplan(
  evaId: string,
): Promise<string | null | undefined> {
  return cache.get(evaId);
}
