import { makeUncommonRequest } from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  SubscrDetailsOptions,
  SubscrDetailsRequest,
  SubscrDetailsResponse,
} from 'types/HAFAS/Subscr/SubscrDetails';

export function SubscribeDetails(
  options: SubscrDetailsOptions,
  profile?: AllowedHafasProfile,
): Promise<SubscrDetailsResponse> {
  const req: SubscrDetailsRequest = {
    req: options,
    meth: 'SubscrDetails',
  };
  return makeUncommonRequest(req, undefined, profile);
}
