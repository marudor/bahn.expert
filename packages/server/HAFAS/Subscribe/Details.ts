import { AllowedHafasProfile } from 'types/HAFAS';
import { makeUncommonRequest } from 'server/HAFAS/Request';
import {
  SubscrDetailsOptions,
  SubscrDetailsRequest,
} from 'types/HAFAS/Subscr/SubscrDetails';

export function SubscribeDetails(
  options: SubscrDetailsOptions,
  profile?: AllowedHafasProfile
) {
  const req: SubscrDetailsRequest = {
    req: options,
    meth: 'SubscrDetails',
  };
  return makeUncommonRequest(req, undefined, profile);
}
