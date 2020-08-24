import { AllowedHafasProfile } from 'types/HAFAS';
import { makeUncommonRequest } from 'server/HAFAS/Request';
import {
  ParsedSubscrUserResponse,
  SubscrUserCreateOptions,
  SubscrUserCreateRequest,
  SubscrUserCreateResponse,
} from 'types/HAFAS/Subscr/SubscrUserCreate';

function parseResponse(r: SubscrUserCreateResponse): ParsedSubscrUserResponse {
  return {
    userId: r.userId,
  };
}

export function SubscribeUserCreate(
  options: SubscrUserCreateOptions,
  profile?: AllowedHafasProfile,
) {
  const req: SubscrUserCreateRequest = {
    req: options,
    meth: 'SubscrUserCreate',
  };

  return makeUncommonRequest(req, parseResponse, profile);
}
