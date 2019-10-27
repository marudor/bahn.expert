import { AllowedHafasProfile, HafasResponse, ParsedCommon } from 'types/HAFAS';
import {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
  ParsedJourneyDetails,
} from 'types/HAFAS/JourneyDetails';
import { parse } from 'date-fns';
import makeRequest from './Request';
import parseAuslastung from './helper/parseAuslastung';
import parseMessages from './helper/parseMessages';
import parseStop from './helper/parseStop';

const parseJourneyDetails = (
  d: HafasResponse<JourneyDetailsResponse>,
  common: ParsedCommon
): ParsedJourneyDetails => {
  const journey = d.svcResL[0].res.journey;

  const date = parse(journey.date, 'yyyyMMdd', new Date());
  const train = common.prodL[journey.prodX];
  const stops = journey.stopL.map(stop =>
    parseStop(stop, common, date, train.type)
  );
  const parsedJourney = {
    train,
    auslastung: parseAuslastung(journey.dTrnCmpSX, common.tcocL),
    jid: journey.jid,
    stops,
    firstStop: stops[0],
    lastStop: stops[stops.length - 1],
    messages: parseMessages(journey.msgL, common),
  };

  return parsedJourney as ParsedJourneyDetails;
};

export default (jid: string, profile?: AllowedHafasProfile) => {
  const req: JourneyDetailsRequest = {
    req: { jid },
    meth: 'JourneyDetails',
  };

  return makeRequest(req, parseJourneyDetails, profile);
};
