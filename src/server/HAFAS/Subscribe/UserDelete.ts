import { makeUncommonRequest } from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  SubscrUserDeleteOptions,
  SubscrUserDeleteRequest,
  SubscrUserDeleteResponse,
} from 'types/HAFAS/Subscr/SubscrUserDelete';

export function SubscribeUserDelete(
  options: SubscrUserDeleteOptions,
  profile?: AllowedHafasProfile,
): Promise<SubscrUserDeleteResponse> {
  const req: SubscrUserDeleteRequest = {
    req: options,
    meth: 'SubscrUserDelete',
  };

  return makeUncommonRequest(req, undefined, profile);
}
