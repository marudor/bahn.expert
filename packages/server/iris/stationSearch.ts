import { CacheDatabases, createNewCache } from 'server/cache';
import { logger } from 'server/logger';
import { noncdRequest } from './helper';
import { orderBy } from 'client/util';
import { parseStation } from 'server/iris/station';
import Fuse from 'fuse.js';
import xmljs from 'libxmljs2';
import type { AxiosInstance } from 'axios';
import type { Element } from 'libxmljs2';
import type { IrisStation } from 'types/station';

// 24 Hours in seconds
const cache = createNewCache<string, IrisStation[]>(
  24 * 60 * 60,
  CacheDatabases.TimetableAll,
);

const fuseSettings = {
  includeScore: true,
  threshold: 0.3,
  tokenize: true,
  matchAllTokens: true,
  minMatchCharLength: 2,
  location: 0,
  distance: 100,
  maxPatternLength: 50,
  keys: ['name', 'eva', 'ds100'],
};

let searchableStations = new Fuse<IrisStation>([], fuseSettings);

async function refreshSearchableStations(
  request: AxiosInstance = noncdRequest,
) {
  try {
    logger.debug('Fetching IRIS Stations to search');
    let cached = await cache.get('*');
    if (!cached) {
      const rawXml = (await request.get<string>(`/station/*`)).data;
      const xml = xmljs.parseXml(rawXml);
      const xmlStations = xml.find<Element>('//station');

      if (!xmlStations || !xmlStations.length) {
        return;
      }

      cached = xmlStations.map(parseStation);
      void cache.set('*', cached);
    }
    searchableStations = new Fuse(cached, fuseSettings);
    logger.debug('Fetched IRIS Stations to search');
  } catch (e) {
    logger.error(e, 'Iris Stations fetch failed');
  }
}

export function stationSearch(searchTerm: string): Promise<IrisStation[]> {
  const matches = searchableStations.search(searchTerm);

  return Promise.resolve(orderBy(matches, 'score').map(({ item }) => item));
}

export async function allStations(): Promise<IrisStation[]> {
  return (await cache.get('*')) || [];
}

if (process.env.NODE_ENV !== 'test') {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(refreshSearchableStations, 10 * 60 * 1000);
  void refreshSearchableStations();
}
