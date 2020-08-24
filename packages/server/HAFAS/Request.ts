import * as HafasProfiles from './profiles';
import {
  AllowedHafasProfile,
  Common,
  GenericRes,
  HafasResponse,
  ParsedCommon,
  SingleHafasRequest,
  UncommonHafasRequest,
} from 'types/HAFAS';
import {
  SubscrCreateRequest,
  SubscrCreateResponse,
} from 'types/HAFAS/Subscr/SubscrCreate';
import {
  SubscrDeleteRequest,
  SubscrDeleteResponse,
} from 'types/HAFAS/Subscr/SubscrDelete';
import {
  SubscrDetailsRequest,
  SubscrDetailsResponse,
} from 'types/HAFAS/Subscr/SubscrDetails';
import {
  SubscrSearchRequest,
  SubscrSearchResponse,
} from 'types/HAFAS/Subscr/SubscrSearch';
import {
  SubscrUserCreateRequest,
  SubscrUserCreateResponse,
} from 'types/HAFAS/Subscr/SubscrUserCreate';
import {
  SubscrUserDeleteRequest,
  SubscrUserDeleteResponse,
} from 'types/HAFAS/Subscr/SubscrUserDelete';
import Axios from 'axios';
import parseLocL from './helper/parseLocL';
import parsePolyline from 'server/HAFAS/helper/parsePolyline';
import parseProduct from './helper/parseProduct';
import type {
  HimSearchRequest,
  HimSearchResponse,
} from 'types/HAFAS/HimSearch';
import type {
  JourneyCourseRequest,
  JourneyCourseResponse,
} from 'types/HAFAS/JourneyCourse';
import type {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
} from 'types/HAFAS/JourneyDetails';
import type {
  JourneyGeoPosRequest,
  JourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';
import type {
  JourneyGraphRequest,
  JourneyGraphResponse,
} from 'types/HAFAS/JourneyGraph';
import type {
  JourneyMatchRequest,
  JourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import type {
  JourneyTreeRequest,
  JourneyTreeResponse,
} from 'types/HAFAS/JourneyTree';
import type {
  LocGeoPosRequest,
  LocGeoPosResponse,
} from 'types/HAFAS/LocGeoPos';
import type { LocMatchRequest, LocMatchResponse } from 'types/HAFAS/LocMatch';
import type {
  SearchOnTripRequest,
  SearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import type {
  StationBoardRequest,
  StationBoardResponse,
} from 'types/HAFAS/StationBoard';
import type {
  TripSearchRequest,
  TripSearchResponse,
} from 'types/HAFAS/TripSearch';

function createRequest(
  req: SingleHafasRequest | UncommonHafasRequest,
  profileType: AllowedHafasProfile,
) {
  const profile = HafasProfiles[profileType];
  const data: any = profile.config;

  const auth = data.auth;

  delete data.auth;

  data.svcReqL = [req];

  data.auth = auth;

  // @ts-ignore 7053
  const extraParam = profile.secret ? profile.secret(data) : undefined;

  return {
    data,
    extraParam,
  };
}

function parseCommon(common: Common): ParsedCommon {
  const prodL = common.prodL.map((p) => parseProduct(p, common));
  const locL = common.locL.map((l) => parseLocL(l, prodL));
  const polyL = common.polyL?.map((p) => parsePolyline(p, locL));

  return {
    ...common,
    locL,
    prodL,
    polyL,
    raw: global.PROD ? undefined : common,
  };
}

export class HafasError extends Error {
  customError = true;
  data: {
    request: SingleHafasRequest | UncommonHafasRequest;
    response: HafasResponse<any>;
    profile: AllowedHafasProfile;
  };
  errorCode: string | undefined;
  constructor(
    request: SingleHafasRequest | UncommonHafasRequest,
    response: HafasResponse<any>,
    profile: AllowedHafasProfile,
  ) {
    super(`${request.meth} HAFAS Error`);
    Error.captureStackTrace(this, HafasError);
    if (response && response.svcResL && response.svcResL.length) {
      this.errorCode = response.svcResL[0].err;
    }
    this.data = {
      request,
      response,
      profile,
    };
  }
}

type CommonHafasResponse<R> = R extends TripSearchRequest
  ? TripSearchResponse
  : R extends JourneyCourseRequest
  ? JourneyCourseResponse
  : R extends JourneyGraphRequest
  ? JourneyGraphResponse
  : R extends JourneyTreeRequest
  ? JourneyTreeResponse
  : R extends StationBoardRequest
  ? StationBoardResponse
  : R extends HimSearchRequest
  ? HimSearchResponse
  : R extends JourneyMatchRequest
  ? JourneyMatchResponse
  : R extends LocGeoPosRequest
  ? LocGeoPosResponse
  : R extends LocMatchRequest
  ? LocMatchResponse
  : R extends JourneyDetailsRequest
  ? JourneyDetailsResponse
  : R extends SearchOnTripRequest
  ? SearchOnTripResponse
  : R extends JourneyGeoPosRequest
  ? JourneyGeoPosResponse
  : never;
async function makeRequest<
  R extends SingleHafasRequest,
  HR extends GenericRes = CommonHafasResponse<R>,
  P = HR
>(
  hafasRequest: R,
  parseFn: (d: HafasResponse<HR>, pc: ParsedCommon) => P = (d) => d as any,
  profile: AllowedHafasProfile = AllowedHafasProfile.DB,
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
  const { data, extraParam } = createRequest(hafasRequest, profile);

  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(hafasRequest));
    // eslint-disable-next-line no-console
    console.log(extraParam);
  }
  const r = (
    await Axios.post<HafasResponse<HR>>(HafasProfiles[profile].url, data, {
      params: extraParam,
    })
  ).data;

  if (('err' in r && r.err !== 'OK') || r.svcResL[0].err !== 'OK') {
    throw new HafasError(hafasRequest, r, profile);
  }

  const rawCommon = r.svcResL[0].res.common;

  if (!rawCommon) {
    throw new HafasError(hafasRequest, r, profile);
  }
  const parsedCommon = parseCommon(rawCommon);

  return parseFn(r, parsedCommon);
}

export default makeRequest;

type UncommonHafasResponse<R> = R extends SubscrCreateRequest
  ? SubscrCreateResponse
  : R extends SubscrDeleteRequest
  ? SubscrDeleteResponse
  : R extends SubscrUserCreateRequest
  ? SubscrUserCreateResponse
  : R extends SubscrUserDeleteRequest
  ? SubscrUserDeleteResponse
  : R extends SubscrDetailsRequest
  ? SubscrDetailsResponse
  : R extends SubscrSearchRequest
  ? SubscrSearchResponse
  : never;

export async function makeUncommonRequest<
  R extends UncommonHafasRequest,
  HR = UncommonHafasResponse<R>,
  P = HR
>(
  hafasRequest: R,
  parseFn: (d: HR) => P = (d) => d as any,
  profile: AllowedHafasProfile = AllowedHafasProfile.DB,
): Promise<P> {
  const { data, extraParam } = createRequest(hafasRequest, profile);
  const r = (
    await Axios.post<HafasResponse<HR>>(HafasProfiles[profile].url, data, {
      params: extraParam,
    })
  ).data;
  if (('err' in r && r.err !== 'OK') || r.svcResL[0].err !== 'OK') {
    throw new HafasError(hafasRequest, r, profile);
  }
  return parseFn(r.svcResL[0].res);
}
