import { AllowedHafasProfile } from 'types/HAFAS';
import { makeUncommonRequest } from 'server/HAFAS/Request';
import {
  ParsedSubscrCreateResponse,
  SubscrCreateOptions,
  SubscrCreateRequest,
  SubscrCreateResponse,
} from 'types/HAFAS/Subscr/SubscrCreate';

function parseResponse(r: SubscrCreateResponse): ParsedSubscrCreateResponse {
  return {
    subscriptionId: r.subscrId,
  };
}

export function SubscribeCreate(
  options: SubscrCreateOptions,
  profile?: AllowedHafasProfile
) {
  const req: SubscrCreateRequest = {
    req: options,
    meth: 'SubscrCreate',
  };

  return makeUncommonRequest(req, parseResponse, profile);
}
