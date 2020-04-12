import {
  AllowedHafasProfile,
  HafasResponse,
  HafasStation,
  ParsedCommon,
} from 'types/HAFAS';
import { CacheDatabases, createNewCache } from 'server/cache';
import { LocMatchRequest, LocMatchResponse } from 'types/HAFAS/LocMatch';
import makeRequest from './Request';
import parseLocL from './helper/parseLocL';

// 8 Hours in seconds
const cache = createNewCache<string, HafasStation[]>(
  8 * 60 * 60,
  CacheDatabases.LocMatch
);

function parseFn(
  d: HafasResponse<LocMatchResponse>,
  parsedCommon: ParsedCommon
): HafasStation[] {
  const stations = d.svcResL[0].res.match.locL;

  return (
    stations
      // .filter(s => s.extId)
      .map((s) => parseLocL(s, parsedCommon.prodL))
  );
}

export default async (
  searchTerm: string,
  type: 'S' | 'ALL' = 'ALL',
  profile?: AllowedHafasProfile,
  raw?: boolean
) => {
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
    return makeRequest<HafasResponse<LocMatchResponse>, HafasStation[]>(
      req,
      undefined,
      profile
    );
  }

  const cacheKey = `${profile}|${type}|${searchTerm}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const result = await makeRequest(req, raw ? undefined : parseFn, profile);

  cache.set(cacheKey, result);

  return result;
};
