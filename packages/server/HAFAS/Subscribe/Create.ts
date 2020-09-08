import { makeUncommonRequest } from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
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
  profile?: AllowedHafasProfile,
): Promise<ParsedSubscrCreateResponse> {
  const req: SubscrCreateRequest = {
    req: options,
    meth: 'SubscrCreate',
  };

  return makeUncommonRequest(req, parseResponse, profile);
}
