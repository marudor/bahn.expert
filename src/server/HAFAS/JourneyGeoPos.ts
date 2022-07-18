import { parse } from 'date-fns';
import { parseCoordinates } from 'server/HAFAS/helper/parseLocL';
import makeRequest from 'server/HAFAS/Request';
import parseStop from 'server/HAFAS/helper/parseStop';
import type {
  AllowedHafasProfile,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import type {
  JourneyGeoPosOptions,
  JourneyGeoPosRequest,
  JourneyGeoPosResponse,
  ParsedJourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';

const parseJourneyGeoPos = (
  r: HafasResponse<JourneyGeoPosResponse>,
  common: ParsedCommon,
): ParsedJourneyGeoPosResponse => {
  return r.svcResL[0].res.jnyL.map((j) => {
    const train = common.prodL[j.prodX];
    const date = parse(j.date, 'yyyyMMdd', Date.now());
    const stops = j.stopL.map((s) => parseStop(s, common, date, train));

    return {
      jid: j.jid,
      date,
      train,
      dirTxt: j.dirTxt,
      dirGeo: j.dirGeo,
      dist: j.dist,
      proc: j.proc,
      isBase: j.isBase,
      position: parseCoordinates(j.pos),
      stops,
      raw: process.env.NODE_ENV !== 'production' ? j : undefined,
    };
  });
};

export default (
  options: JourneyGeoPosOptions,
  profile?: AllowedHafasProfile,
  raw?: boolean,
): Promise<ParsedJourneyGeoPosResponse> => {
  const req: JourneyGeoPosRequest = {
    req: options,
    meth: 'JourneyGeoPos',
  };

  return makeRequest(req, raw ? undefined : parseJourneyGeoPos, profile);
};
