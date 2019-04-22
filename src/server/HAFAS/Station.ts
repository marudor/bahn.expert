import { HafasResponse } from 'types/hafas';
import { LocMatchRequest, LocMatchResponse } from 'types/hafas/LocMatch';
import { Station } from 'types/station';
import makeRequest from './Request';

function parseFn(d: HafasResponse<LocMatchResponse>): Station[] {
  const stations = d.svcResL[0].res.match.locL;

  return stations
    .filter(s => !s.meta)
    .map(s => ({
      title: s.name,
      id: s.extId.substr(2),
      raw: global.PROD ? undefined : s,
    }));
}

export default (searchTerm: string, type: 'S' | 'ALL' = 'S') => {
  const req: LocMatchRequest = {
    req: {
      input: {
        loc: {
          name: `${searchTerm}?`,
          type,
        },
        field: 'S',
      },
    },
    meth: 'LocMatch',
  };

  return makeRequest(req, parseFn);
};
