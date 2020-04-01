import {
  AllowedHafasProfile,
  HafasResponse,
  HafasStation,
  ParsedCommon,
} from 'types/HAFAS';
import { LocMatchRequest, LocMatchResponse } from 'types/HAFAS/LocMatch';
import makeRequest from './Request';
import NodeCache from 'node-cache';
import parseLocL from './helper/parseLocL';

// 8 Hours in seconds
const stdTTL = 8 * 60 * 60;
const cache = new NodeCache({ stdTTL });

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
  const cached = cache.get<HafasStation[]>(cacheKey);

  if (cached) {
    return cached;
  }

  const result = await makeRequest(req, raw ? undefined : parseFn, profile);

  cache.set(cacheKey, result);

  return result;
};
