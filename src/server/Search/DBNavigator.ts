import { Station } from 'types/station';
import axios from 'axios';
import createChecksum from 'server/dbNavUtil';

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

export default async (
  searchTerm: string,
  type: 'S' | 'ALL' = 'S'
): Promise<Station[]> => {
  const { data, checksum } = createRequest(searchTerm, type);

  const r = await axios.post(
    'https://reiseauskunft.bahn.de/bin/mgate.exe',
    data,
    {
      params: {
        checksum,
      },
    }
  );
  const d = r.data;
  const stations = d.svcResL[0].res.match.locL;

  return stations
    .filter((s: any) => !s.meta)
    .map((s: any) => ({
      title: s.name,
      id: s.extId.substr(2),
      raw: global.PROD ? undefined : s,
    }));
};
