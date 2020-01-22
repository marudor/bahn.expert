import { AllowedHafasProfile, HafasResponse, ParsedCommon } from 'types/HAFAS';
import {
  HimSearchRequest,
  HimSearchResponse,
  ParsedHimSearchResponse,
} from 'types/HAFAS/HimSearch';
import makeRequest from 'server/HAFAS/Request';

const parseHimSearch = (
  d: HafasResponse<HimSearchResponse>,
  _common: ParsedCommon
): ParsedHimSearchResponse => {
  return {
    messages: d.svcResL[0].res.msgL,
  };
};

export default (
  request: HimSearchRequest['req'],
  profile?: AllowedHafasProfile,
  raw?: boolean
): Promise<ParsedHimSearchResponse> => {
  const req: HimSearchRequest = {
    req: request,
    meth: 'HimSearch',
  };

  return makeRequest(req, raw ? undefined : parseHimSearch, profile);
};
