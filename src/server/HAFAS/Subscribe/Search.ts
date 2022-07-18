import { makeUncommonRequest } from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  SubscrSearchOptions,
  SubscrSearchRequest,
  SubscrSearchResponse,
} from 'types/HAFAS/Subscr/SubscrSearch';

export function SubscribeSearch(
  options: SubscrSearchOptions,
  profile?: AllowedHafasProfile,
): Promise<SubscrSearchResponse> {
  const req: SubscrSearchRequest = {
    req: options,
    meth: 'SubscrSearch',
  };

  return makeUncommonRequest(req, undefined, profile);
}
