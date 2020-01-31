import { AllowedHafasProfile } from 'types/HAFAS';
import {
  JourneyCourseRequest,
  JourneyCourseRequestOptions,
} from 'types/HAFAS/JourneyCourse';
import makeRequest from 'server/HAFAS/Request';

export default (
  options: JourneyCourseRequestOptions,
  profile?: AllowedHafasProfile
) => {
  const req: JourneyCourseRequest = {
    req: options,
    meth: 'JourneyCourse',
  };

  return makeRequest(req, undefined, profile);
};
