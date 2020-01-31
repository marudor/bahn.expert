import { AllowedHafasProfile } from 'types/HAFAS';
import {
  JourneyTreeRequest,
  JourneyTreeRequestOptions,
} from 'types/HAFAS/JourneyTree';
import makeRequest from 'server/HAFAS/Request';

export default (
  options: JourneyTreeRequestOptions,
  profile?: AllowedHafasProfile
) => {
  const req: JourneyTreeRequest = {
    req: options,
    meth: 'JourneyTree',
  };

  return makeRequest(req, undefined, profile);
};
