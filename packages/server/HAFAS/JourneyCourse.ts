import makeRequest from 'server/HAFAS/Request';
import type {
  AllowedHafasProfile,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import type {
  JourneyCourseRequest,
  JourneyCourseRequestOptions,
  JourneyCourseResponse,
  ParsedJourneyCourseResponse,
} from 'types/HAFAS/JourneyCourse';

function parseJourneyCourse(
  r: HafasResponse<JourneyCourseResponse>,
  common: ParsedCommon,
): ParsedJourneyCourseResponse {
  const polyL = common.polyL;

  if (!polyL) throw new Error('missing Polylines from HAFAS');

  return {
    polylines: r.svcResL[0].res.mainPoly.polyXL.map(
      (polyIndex) => polyL[polyIndex],
    ),
  };
}

export default (
  options: JourneyCourseRequestOptions,
  profile?: AllowedHafasProfile,
  raw?: boolean,
) => {
  const req: JourneyCourseRequest = {
    req: options,
    meth: 'JourneyCourse',
  };

  return makeRequest(req, raw ? undefined : parseJourneyCourse, profile);
};
