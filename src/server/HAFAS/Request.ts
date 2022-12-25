import * as HafasProfiles from './profiles';
import { AllowedHafasProfile } from 'types/HAFAS';
import Axios from 'axios';
import parseLocL from './helper/parseLocL';
import parsePolyline from 'server/HAFAS/helper/parsePolyline';
import parseProduct from './helper/parseProduct';
import type {
  Common,
  GenericRes,
  HafasResponse,
  ParsedCommon,
  SingleHafasRequest,
} from 'types/HAFAS';
import type {
  HimSearchRequest,
  HimSearchResponse,
} from 'types/HAFAS/HimSearch';
import type {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
} from 'types/HAFAS/JourneyDetails';
import type {
  JourneyMatchRequest,
  JourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
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
  req: SingleHafasRequest,
  profileType: AllowedHafasProfile,
) {
  const profile = HafasProfiles[profileType];
  const data: any = profile.config;

  const auth = data.auth;

  delete data.auth;

  data.svcReqL = [req];

  data.auth = auth;

  // @ts-expect-error 7053
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
  : R extends StationBoardRequest
  ? StationBoardResponse
  : R extends HimSearchRequest
  ? HimSearchResponse
  : R extends JourneyMatchRequest
  ? JourneyMatchResponse
  : R extends LocMatchRequest
  ? LocMatchResponse
  : R extends JourneyDetailsRequest
  ? JourneyDetailsResponse
  : R extends SearchOnTripRequest
  ? SearchOnTripResponse
  : never;
async function makeRequest<
  R extends SingleHafasRequest,
  HR extends GenericRes = CommonHafasResponse<R>,
  P = HR,
>(
  hafasRequest: R,
  parseFn: (d: HafasResponse<HR>, pc: ParsedCommon) => P = (d) => d as any,
  profile: AllowedHafasProfile = AllowedHafasProfile.DB,
): Promise<P> {
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
