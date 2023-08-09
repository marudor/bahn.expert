import { Cache, CacheDatabase } from '@/server/cache';
import { parseLocL } from './helper/parseLocL';
import makeRequest from './Request';
import type {
  AllowedHafasProfile,
  HafasResponse,
  HafasStation,
  ParsedCommon,
} from '@/types/HAFAS';
import type { LocMatchRequest, LocMatchResponse } from '@/types/HAFAS/LocMatch';

const cache = new Cache<HafasStation[]>(CacheDatabase.LocMatch);

function parseFn(
  d: HafasResponse<LocMatchResponse>,
  parsedCommon: ParsedCommon,
): Promise<HafasStation[]> {
  const stations = d.svcResL[0].res.match.locL;

  return Promise.all(
    stations
      // .filter(s => s.extId)
      .map((s) => parseLocL(s, parsedCommon.prodL)),
  );
}

export const locMatch = async (
  searchTerm: string,
  type: 'S' | 'ALL',
  profile?: AllowedHafasProfile,
  raw?: boolean,
): Promise<HafasStation[]> => {
  const req: LocMatchRequest = {
    req: {
      input: {
        loc: {
          name: searchTerm,
          type,
        },
        field: 'S',
      },
    },
    meth: 'LocMatch',
  };

  if (raw) {
    return makeRequest(req, undefined, profile) as any;
  }

  const cacheKey = `${profile}|${type}|${searchTerm}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const result = await makeRequest(req, raw ? undefined : parseFn, profile);

  void cache.set(cacheKey, result);

  return result;
};
