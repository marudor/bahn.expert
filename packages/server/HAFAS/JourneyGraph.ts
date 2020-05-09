import makeRequest from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  JourneyGraphRequest,
  JourneyGraphRequestOptions,
} from 'types/HAFAS/JourneyGraph';

export default (
  options: JourneyGraphRequestOptions,
  profile?: AllowedHafasProfile
) => {
  const req: JourneyGraphRequest = {
    req: options,
    meth: 'JourneyGraph',
  };

  return makeRequest(req, undefined, profile);
};
