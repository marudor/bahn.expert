import * as HafasProfiles from './profiles';
import {
  AllowedHafasProfile,
  Common,
  GenericRes,
  HafasResponse,
  ParsedCommon,
  SingleHafasRequest,
} from 'types/HAFAS';
import { HimSearchRequest, HimSearchResponse } from 'types/HAFAS/HimSearch';
import {
  JourneyCourseRequest,
  JourneyCourseResponse,
} from 'types/HAFAS/JourneyCourse';
import {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
} from 'types/HAFAS/JourneyDetails';
import {
  JourneyGeoPosRequest,
  JourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';
import {
  JourneyGraphRequest,
  JourneyGraphResponse,
} from 'types/HAFAS/JourneyGraph';
import {
  JourneyMatchRequest,
  JourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import {
  JourneyTreeRequest,
  JourneyTreeResponse,
} from 'types/HAFAS/JourneyTree';
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
import parseLocL from './helper/parseLocL';
import parseProduct from './helper/parseProduct';

function createRequest(
  req: SingleHafasRequest,
  profileType: AllowedHafasProfile
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
  const prodL = common.prodL.map(p => parseProduct(p, common));
  const locL = common.locL.map(l => parseLocL(l, prodL));

  return {
    ...common,
    locL,
    prodL,
    raw: global.PROD ? undefined : common,
  };
}

export class HafasError extends Error {
  customError = true;
  data: {
    request: SingleHafasRequest;
    response: HafasResponse<any>;
    profile: AllowedHafasProfile;
  };
  errorCode: string | undefined;
  constructor(
    request: SingleHafasRequest,
    response: HafasResponse<any>,
    profile: AllowedHafasProfile
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
function makeRequest<R extends HafasResponse<JourneyCourseResponse>, P = R>(
  r: JourneyCourseRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<JourneyGraphResponse>, P = R>(
  r: JourneyGraphRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<JourneyTreeResponse>, P = R>(
  r: JourneyTreeRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<StationBoardResponse>, P = R>(
  r: StationBoardRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<HimSearchResponse>, P = R>(
  r: HimSearchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<JourneyMatchResponse>, P = R>(
  r: JourneyMatchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<LocGeoPosResponse>, P = R>(
  r: LocGeoPosRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<LocMatchResponse>, P = R>(
  r: LocMatchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<JourneyDetailsResponse>, P = R>(
  r: JourneyDetailsRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<SearchOnTripResponse>, P = R>(
  r: SearchOnTripRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<TripSearchResponse>, P = R>(
  r: TripSearchRequest,
  parseFn?: (d: R, pc: ParsedCommon) => P,
  profile?: AllowedHafasProfile
): Promise<P>;
function makeRequest<R extends HafasResponse<JourneyGeoPosResponse>, P = R>(
  r: JourneyGeoPosRequest,
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

  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(request));
    // eslint-disable-next-line no-console
    console.log(extraParam);
  }
  const r = (
    await axios.post<HafasResponse<HR>>(HafasProfiles[profile].url, data, {
      params: extraParam,
    })
  ).data;

  if (r.err !== 'OK' || r.svcResL[0].err !== 'OK') {
    throw new HafasError(request, r, profile);
  }

  const rawCommon = r.svcResL[0].res.common;

  if (!rawCommon) {
    throw new HafasError(request, r, profile);
  }
  const parsedCommon = parseCommon(rawCommon);

  return parseFn(r, parsedCommon);
}

export default makeRequest;
