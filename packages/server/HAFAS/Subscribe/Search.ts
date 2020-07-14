import { AllowedHafasProfile } from 'types/HAFAS';
import { makeUncommonRequest } from 'server/HAFAS/Request';
import {
  SubscrSearchOptions,
  SubscrSearchRequest,
} from 'types/HAFAS/Subscr/SubscrSearch';

export function SubscribeSearch(
  options: SubscrSearchOptions,
  profile?: AllowedHafasProfile
) {
  const req: SubscrSearchRequest = {
    req: options,
    meth: 'SubscrSearch',
  };

  return makeUncommonRequest(req, undefined, profile);
}
