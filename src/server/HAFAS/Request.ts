import {
  Common,
  GenericRes,
  HafasResponse,
  ParsedCommon,
  SingleHafasRequest,
} from 'types/HAFAS';
import {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
} from 'types/HAFAS/JourneyDetails';
import { LocGeoPosRequest, LocGeoPosResponse } from 'types/HAFAS/LocGeoPos';
import { LocMatchRequest, LocMatchResponse } from 'types/HAFAS/LocMatch';
import {
  StationBoardRequest,
  StationBoardResponse,
} from 'types/HAFAS/StationBoard';
import { TripSearchRequest, TripSearchResponse } from 'types/HAFAS/TripSearch';
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
    client: { id: 'DB', v: '19040000', type: 'AND', name: 'DB Navigator' },
    ext: 'DB.R19.04.a',
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

function parseCommon(common: Common): ParsedCommon {
  return {
    ...common,
    locL: common.locL.map(l => ({
      id: l.extId,
      title: l.name,
    })),
  };
}

// @ts-ignore ???
declare function makeRequest<
  R extends HafasResponse<StationBoardResponse>,
  P = R
>(r: StationBoardRequest, parseFn?: (d: R, pc: ParsedCommon) => P): Promise<P>;
// @ts-ignore ???
declare function makeRequest<R extends HafasResponse<LocGeoPosResponse>, P = R>(
  r: LocGeoPosRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P
): Promise<P>;
// @ts-ignore ???
declare function makeRequest<R extends HafasResponse<LocMatchResponse>, P = R>(
  r: LocMatchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P
): Promise<P>;
// @ts-ignore ???
declare function makeRequest<
  R extends HafasResponse<JourneyDetailsResponse>,
  P = R
>(
  r: JourneyDetailsRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P
): Promise<P>;
// @ts-ignore ???
declare function makeRequest<
  R extends HafasResponse<TripSearchResponse>,
  P = R
>(r: TripSearchRequest, parseFn?: (d: R, pc: ParsedCommon) => P): Promise<P>;
async function makeRequest<
  R extends SingleHafasRequest,
  HR extends GenericRes,
  P
>(
  request: R,
  parseFn: (d: HafasResponse<HR>, pc: ParsedCommon) => P = d => d as any
): Promise<P> {
  const { data, checksum } = createRequest(request);
  const r = (await axios.post<HafasResponse<HR>>(mgateUrl, data, {
    params: {
      checksum,
    },
  })).data;

  if (r.err !== 'OK' || r.svcResL[0].err !== 'OK') throw r;

  const parsedCommon = parseCommon(r.svcResL[0].res.common);

  return parseFn(r, parsedCommon);
}

export default makeRequest;
