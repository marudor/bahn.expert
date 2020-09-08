import { makeUncommonRequest } from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { SubscrDeleteResponse } from 'types/HAFAS/Subscr/SubscrDelete';
import type {
  SubscrDetailsOptions,
  SubscrDetailsRequest,
} from 'types/HAFAS/Subscr/SubscrDetails';

export function SubscribeDetails(
  options: SubscrDetailsOptions,
  profile?: AllowedHafasProfile,
): Promise<SubscrDeleteResponse> {
  const req: SubscrDetailsRequest = {
    req: options,
    meth: 'SubscrDetails',
  };
  return makeUncommonRequest(req, undefined, profile);
}
