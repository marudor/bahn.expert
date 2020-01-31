import { AllowedHafasProfile } from 'types/HAFAS';
import {
  JourneyGraphRequest,
  JourneyGraphRequestOptions,
} from 'types/HAFAS/JourneyGraph';
import makeRequest from 'server/HAFAS/Request';

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
