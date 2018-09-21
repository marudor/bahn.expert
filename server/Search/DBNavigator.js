// @flow
import axios from 'axios';
import Crypto from 'crypto';
import type { Station } from 'types/abfahrten';

function getSecret() {
  const enc = Buffer.from('rGhXPq+xAlvJd8T8cMnojdD0IoaOY53X7DPAbcXYe5g=', 'base64');
  const key = Buffer.from([97, 72, 54, 70, 56, 122, 82, 117, 105, 66, 110, 109, 51, 51, 102, 85]);
  const iv = Buffer.alloc(16);
  const cipher = Crypto.createDecipheriv('aes-128-cbc', key, iv);
  const secret = cipher.update(enc, undefined, 'ascii') + cipher.final('ascii');

  return secret;
}

const secret = getSecret();

function createChecksum(data) {
  const hasher = Crypto.createHash('md5');

  hasher.update(JSON.stringify(data) + secret);

  return hasher.digest('hex');
}

function createRequest(searchTerm: string) {
  const data = {
    client: { id: 'DB', v: '18040000', type: 'IPH', name: 'DB Navigator' },
    lang: 'de',
    ver: '1.20',
    svcReqL: [
      {
        req: { input: { loc: { name: `${searchTerm}?`, type: 'S', state: 'F', icoX: 0 }, field: 'S' } },
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

export default (searchTerm: string): Promise<Station[]> => {
  const { data, checksum } = createRequest(searchTerm);

  return axios
    .post('https://reiseauskunft.bahn.de/bin/mgate.exe', data, {
      params: {
        checksum,
      },
    })
    .then(r => r.data)
    .then(d => d.svcResL[0].res.match.locL)
    .then(stations =>
      stations.filter(s => !s.meta).map(s => ({
        title: s.name,
        id: s.extId.substr(2),
      }))
    );
};
