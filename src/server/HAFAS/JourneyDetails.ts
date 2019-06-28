import { HafasResponse, ParsedCommon } from 'types/HAFAS';
import {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
} from 'types/HAFAS/JourneyDetails';
import { parse } from 'date-fns';
import makeRequest from './Request';
import parseAuslastung from './helper/parseAuslastung';
import parseStop from './helper/parseStop';

const parseJourneyDetails = (
  d: HafasResponse<JourneyDetailsResponse>,
  common: ParsedCommon
) => {
  const journey = d.svcResL[0].res.journey;

  const date = parse(journey.date, 'yyyyMMdd', new Date()).getTime();
  const train = common.prodL[journey.prodX];
  const parsedJourney = {
    train,
    auslastung: parseAuslastung(journey.dTrnCmpSX, common.tcocL),
    jid: journey.jid,
    stops: journey.stopL.map(stop => parseStop(stop, common, date, train.type)),
  };

  return parsedJourney;
};

export default (jid: string) => {
  const req: JourneyDetailsRequest = {
    req: { jid },
    meth: 'JourneyDetails',
  };

  return makeRequest(req, parseJourneyDetails);
};
