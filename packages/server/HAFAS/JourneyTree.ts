import makeRequest from 'server/HAFAS/Request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  JourneyTreeRequest,
  JourneyTreeRequestOptions,
  JourneyTreeResponse,
} from 'types/HAFAS/JourneyTree';

export default (
  options: JourneyTreeRequestOptions,
  profile?: AllowedHafasProfile,
): Promise<JourneyTreeResponse> => {
  const req: JourneyTreeRequest = {
    req: options,
    meth: 'JourneyTree',
  };

  return makeRequest(req, undefined, profile);
};
