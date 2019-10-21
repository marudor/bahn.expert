import { AllowedHafasProfile, HafasResponse, ParsedCommon } from 'types/HAFAS';
import { LocMatchRequest, LocMatchResponse } from 'types/HAFAS/LocMatch';
import { Station } from 'types/station';
import makeRequest from './Request';
import parseLocL from './helper/parseLocL';

function parseFn(
  d: HafasResponse<LocMatchResponse>,
  parsedCommon: ParsedCommon
): Station[] {
  const stations = d.svcResL[0].res.match.locL;

  return (
    stations
      // .filter(s => s.extId)
      .map(s => parseLocL(s, parsedCommon.prodL))
  );
}

export default (
  searchTerm: string,
  type: 'S' | 'ALL' = 'ALL',
  profile?: AllowedHafasProfile
) => {
  const req: LocMatchRequest = {
    req: {
      input: {
        loc: {
          name: `${searchTerm}`,
          type,
        },
        field: 'S',
      },
    },
    meth: 'LocMatch',
  };

  return makeRequest(req, parseFn, profile);
};
