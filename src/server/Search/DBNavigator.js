// @flow
import axios from 'axios';
import createChecksum from 'server/dbNavUtil';
import type { Station } from 'types/station';

function createRequest(searchTerm: string, type: 'S' | 'ALL') {
  const data = {
    client: { id: 'DB', v: '18120000', type: 'IPH', name: 'DB Navigator' },
    lang: 'de',
    ver: '1.20',
    svcReqL: [
      {
        req: { input: { loc: { name: `${searchTerm}?`, type }, field: 'S' } },
        meth: 'LocMatch',
      },
    ],
    auth: { aid: 'n91dB8Z77MLdoR0K', type: 'AID' },
  };

  return {
    data,
    checksum: createChecksum(data),
  };
}

export default (
  searchTerm: string,
  type: 'S' | 'ALL' = 'S'
): Promise<Station[]> => {
  const { data, checksum } = createRequest(searchTerm, type);

  return axios
    .post('https://reiseauskunft.bahn.de/bin/mgate.exe', data, {
      params: {
        checksum,
      },
    })
    .then(r => r.data)
    .then(d => d.svcResL[0].res.match.locL)
    .then(stations =>
      stations
        .filter(s => !s.meta)
        .map(s => ({
          title: s.name,
          id: s.extId.substr(2),
          raw: PROD ? undefined : s,
        }))
    );
};
