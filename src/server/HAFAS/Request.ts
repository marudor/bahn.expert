import {
  AllowedHafasProfile,
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
import {
  JourneyMatchRequest,
  JourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import { LocGeoPosRequest, LocGeoPosResponse } from 'types/HAFAS/LocGeoPos';
import { LocMatchRequest, LocMatchResponse } from 'types/HAFAS/LocMatch';
import {
  SearchOnTripRequest,
  SearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import {
  StationBoardRequest,
  StationBoardResponse,
} from 'types/HAFAS/StationBoard';
import { TripSearchRequest, TripSearchResponse } from 'types/HAFAS/TripSearch';
import axios from 'axios';
import Crypto from 'crypto';
import parseLocL from './helper/parseLocL';
import parseProduct from './helper/parseProduct';

function getSecret(hciChecksum: string) {
  const enc = Buffer.from(hciChecksum, 'base64');
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

const mgateUrls = {
  db: 'https://reiseauskunft.bahn.de/bin/mgate.exe',
  oebb: 'https://fahrplan.oebb.at/bin/mgate.exe',
  sncb: 'http://www.belgianrail.be/jp/sncb-nmbs-routeplanner/mgate.exe',
  avv: 'https://auskunft.avv.de/bin/mgate.exe',
  nahsh: 'https://nah.sh.hafas.de/bin/mgate.exe',
  hvv: 'https://hvv-app.hafas.de/bin/mgate.exe',
  bvg: 'https://bvg-apps.hafas.de/bin/mgate.exe',
};
const dbSecret = getSecret('rGhXPq+xAlvJd8T8cMnojdD0IoaOY53X7DPAbcXYe5g=');
const hvvSecret = getSecret('ktlwfW4vVOf/LwJ4wsnENvzRQZf3WS9b1RMPbIQNEOw=');

const extraAuth = {
  db: (data: any) => {
    const hasher = Crypto.createHash('md5');

    hasher.update(JSON.stringify(data) + dbSecret);

    return {
      checksum: hasher.digest('hex'),
    };
  },
  hvv: (data: any) => {
    const micHasher = Crypto.createHash('md5');

    micHasher.update(JSON.stringify(data));
    const mic = micHasher.digest('hex');
    const macHasher = Crypto.createHash('md5');

    macHasher.update(mic + hvvSecret);

    return { mic, mac: macHasher.digest('hex') };
  },
};

const staticData = {
  db: {
    client: {
      id: 'DB',
      v: '19040000',
      type: 'AND',
      name: 'DB Navigator',
    },
    ext: 'DB.R19.04.a',
    lang: 'de',
    ver: '1.18',
    auth: {
      aid: 'n91dB8Z77MLdoR0K',
      type: 'AID',
    },
  },
  oebb: {
    client: {
      os: 'iOS 12.4',
      id: 'OEBB',
      v: '6020300',
      type: 'IPH',
      name: 'oebbADHOC',
    },
    lang: 'de',
    ver: '1.18',
    auth: { aid: 'OWDL4fE4ixNiPBBm', type: 'AID' },
  },
  sncb: {
    client: {
      os: 'iOS 12.4',
      id: 'SNCB',
      v: '4030200',
      type: 'IPH',
      name: 'sncb',
    },
    lang: 'de',
    ver: '1.18',
    auth: { aid: 'sncb-mobi', type: 'AID' },
  },
  avv: {
    client: {
      id: 'HAFAS',
      type: 'WEB',
      name: 'Test-Client',
      v: '100',
    },
    lang: 'deu',
    ver: '1.18',
    auth: {
      type: 'AID',
      aid: '4vV1AcH3N511icH',
    },
  },
  nahsh: {
    client: {
      os: 'iOS 12.4',
      id: 'NAHSH',
      v: '4000000',
      type: 'IPH',
      name: 'NAHSHAPPSTORE',
    },
    lang: 'de',
    ver: '1.18',
    auth: { aid: 'r0Ot9FLFNAFxijLW', type: 'AID' },
  },
  hvv: {
    client: {
      os: 'iOS 12.4',
      id: 'HVV',
      v: '4020100',
      type: 'IPH',
      name: 'HVVPROD_ADHOC',
    },
    lang: 'de',
    ext: 'HVV.1',
    ver: '1.18',
    auth: {
      aid: 'andcXUmC9Mq6hjrwDIGd2l3oiaMrTUzyH',
      type: 'aid',
    },
  },
  bvg: {
    client: {
      os: 'iOS 12.4',
      id: 'BVG',
      v: '6021600',
      type: 'IPH',
      name: 'Fahrinfo',
    },
    lang: 'de',
    ver: '1.18',
    auth: {
      aid: 'Mz0YdF9Fgx0Mb9',
      type: 'AID',
    },
  },
};

function createRequest(req: SingleHafasRequest, profile: AllowedHafasProfile) {
  const data: any = staticData[profile];

  const auth = data.auth;

  delete data.auth;

  data.svcReqL = [req];

  data.auth = auth;

  // @ts-ignore 7053
  const extraParam = extraAuth[profile] ? extraAuth[profile](data) : undefined;

  return {
    data,
    extraParam,
  };
}

function parseCommon(common: Common): ParsedCommon {
  const prodL = common.prodL.map(p => parseProduct(p));
  const locL = common.locL.map(l => parseLocL(l, prodL));

  return {
    ...common,
    locL,
    prodL,
    raw: global.PROD ? undefined : common,
  };
}

class HafasError extends Error {
  customError = true;
  data: {
    request: SingleHafasRequest;
    response: HafasResponse<any>;
    profile: AllowedHafasProfile;
  };
  constructor(
    request: SingleHafasRequest,
    response: HafasResponse<any>,
    profile: AllowedHafasProfile
  ) {
    super(`${request.meth} HAFAS Error`);
    Error.captureStackTrace(this, HafasError);
    this.data = {
      request,
      response,
      profile,
    };
  }
}

// @ts-ignore 2384
declare function makeRequest<
  R extends HafasResponse<StationBoardResponse>,
  P = R
>(
  r: StationBoardRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
// @ts-ignore 2384
declare function makeRequest<
  R extends HafasResponse<JourneyMatchResponse>,
  P = R
>(
  r: JourneyMatchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
// @ts-ignore 2384
declare function makeRequest<R extends HafasResponse<LocGeoPosResponse>, P = R>(
  r: LocGeoPosRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
// @ts-ignore 2384
declare function makeRequest<R extends HafasResponse<LocMatchResponse>, P = R>(
  r: LocMatchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
// @ts-ignore 2384
declare function makeRequest<
  R extends HafasResponse<JourneyDetailsResponse>,
  P = R
>(
  r: JourneyDetailsRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
// @ts-ignore 2384
declare function makeRequest<
  R extends HafasResponse<SearchOnTripResponse>,
  P = R
>(
  r: SearchOnTripRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
// @ts-ignore 2384
declare function makeRequest<
  R extends HafasResponse<TripSearchResponse>,
  P = R
>(
  r: TripSearchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
async function makeRequest<
  R extends SingleHafasRequest,
  HR extends GenericRes,
  P
>(
  request: R,
  parseFn: (d: HafasResponse<HR>, pc: ParsedCommon) => P = d => d as any,
  profile: AllowedHafasProfile = AllowedHafasProfile.db
): Promise<P> {
  // if (profile === 'all') {
  //   const prod = global.PROD;

  //   global.PROD = true;
  //   const promises: any[] = [];

  //   Object.keys(AllowedHafasProfile).forEach(p => {
  //     // @ts-ignore
  //     promises.push(makeRequest(request, parseFn, p).then(r => [p, r]));
  //   });
  //   const results = await Promise.all(promises);

  //   global.PROD = prod;

  //   return results.reduce((agg, [p, r]) => {
  //     agg[p] = r;

  //     return agg;
  //   }, {});
  // }
  const { data, extraParam } = createRequest(request, profile);

  // if (process.env.NODE_ENV === 'test') {
  //   // eslint-disable-next-line no-console
  //   console.log(JSON.stringify(request));
  //   // eslint-disable-next-line no-console
  //   console.log(extraParam);
  // }
  const r = (await axios.post<HafasResponse<HR>>(mgateUrls[profile], data, {
    params: extraParam,
  })).data;

  if (r.err !== 'OK' || r.svcResL[0].err !== 'OK') {
    throw new HafasError(request, r, profile);
  }

  const parsedCommon = parseCommon(r.svcResL[0].res.common);

  return parseFn(r, parsedCommon);
}

export default makeRequest;
