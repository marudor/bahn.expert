import { HafasResponse, SingleHafasRequest } from 'types/hafas';
import {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
} from 'types/hafas/JourneyDetails';
import { LocMatchRequest, LocMatchResponse } from 'types/hafas/LocMatch';
import { TripSearchRequest, TripSearchResponse } from 'types/hafas/TripSearch';
import axios from 'axios';
import Crypto from 'crypto';

function getSecret() {
  const enc = Buffer.from(
    'rGhXPq+xAlvJd8T8cMnojdD0IoaOY53X7DPAbcXYe5g=',
    'base64'
  );
  const key = Buffer.from([
    97,
    72,
    54,
    70,
    56,
    122,
    82,
    117,
    105,
    66,
    110,
    109,
    51,
    51,
    102,
    85,
  ]);
  const iv = Buffer.alloc(16);
  const cipher = Crypto.createDecipheriv('aes-128-cbc', key, iv);
  const secret = cipher.update(enc, undefined, 'ascii') + cipher.final('ascii');

  return secret;
}

const secret = getSecret();

function createChecksum(data: any) {
  const hasher = Crypto.createHash('md5');

  hasher.update(JSON.stringify(data) + secret);

  return hasher.digest('hex');
}

const mgateUrl = 'https://reiseauskunft.bahn.de/bin/mgate.exe';

function createRequest(req: SingleHafasRequest) {
  const data = {
    client: { id: 'DB', v: '18120000', type: 'IPH', name: 'DB Navigator' },
    ext: 'DB.R18.06.a',
    lang: 'de',
    ver: '1.20',
    svcReqL: [req],
    auth: { aid: 'n91dB8Z77MLdoR0K', type: 'AID' },
  };

  return {
    data,
    checksum: createChecksum(data),
  };
}
// @ts-ignore ???
declare function makeRequest<R extends HafasResponse<LocMatchResponse>, P = R>(
  r: LocMatchRequest,
  parseFn?: (d: R) => P
): Promise<P>;
// @ts-ignore ???
declare function makeRequest<
  R extends HafasResponse<JourneyDetailsResponse>,
  P = R
>(r: JourneyDetailsRequest, parseFn?: (d: R) => P): Promise<P>;
// @ts-ignore ???
declare function makeRequest<
  R extends HafasResponse<TripSearchResponse>,
  P = R
>(r: TripSearchRequest, parseFn?: (d: R) => P): Promise<P>;
async function makeRequest<R extends SingleHafasRequest, HR, P>(
  request: R,
  parseFn: (d: HafasResponse<HR>) => P = d => d as any
): Promise<P> {
  const { data, checksum } = createRequest(request);
  const r = (await axios.post<HafasResponse<HR>>(
    'https://reiseauskunft.bahn.de/bin/mgate.exe',
    data,
    {
      params: {
        checksum,
      },
    }
  )).data;

  if (r.err !== 'OK' || r.svcResL[0].err !== 'OK') throw r;

  return parseFn(r);
}

export default makeRequest;
