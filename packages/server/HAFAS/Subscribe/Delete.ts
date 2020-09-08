import { makeUncommonRequest } from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  SubscrDeleteOptions,
  SubscrDeleteRequest,
} from 'types/HAFAS/Subscr/SubscrDelete';

export function SubscribeDelete(
  options: SubscrDeleteOptions,
  profile?: AllowedHafasProfile,
): Promise<SubscrDeleteResponse> {
  const req: SubscrDeleteRequest = {
    req: options,
    meth: 'SubscrDelete',
  };

  return makeUncommonRequest(req, undefined, profile);
}
