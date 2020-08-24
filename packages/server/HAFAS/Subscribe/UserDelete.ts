import { AllowedHafasProfile } from 'types/HAFAS';
import { makeUncommonRequest } from 'server/HAFAS/Request';
import {
  SubscrUserDeleteOptions,
  SubscrUserDeleteRequest,
} from 'types/HAFAS/Subscr/SubscrUserDelete';

export function SubscribeUserDelete(
  options: SubscrUserDeleteOptions,
  profile?: AllowedHafasProfile,
) {
  const req: SubscrUserDeleteRequest = {
    req: options,
    meth: 'SubscrUserDelete',
  };

  return makeUncommonRequest(req, undefined, profile);
}
