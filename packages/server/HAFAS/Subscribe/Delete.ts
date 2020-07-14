import { AllowedHafasProfile } from 'types/HAFAS';
import { makeUncommonRequest } from 'server/HAFAS/Request';
import {
  SubscrDeleteOptions,
  SubscrDeleteRequest,
} from 'types/HAFAS/Subscr/SubscrDelete';

export function SubscribeDelete(
  options: SubscrDeleteOptions,
  profile?: AllowedHafasProfile
) {
  const req: SubscrDeleteRequest = {
    req: options,
    meth: 'SubscrDelete',
  };

  return makeUncommonRequest(req, undefined, profile);
}
