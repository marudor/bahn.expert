import { adjustProductOperator } from 'server/HAFAS/helper/adjustProductOperator';
import { parse } from 'date-fns';
import makeRequest from './Request';
import parseAuslastung from './helper/parseAuslastung';
import parseMessages from './helper/parseMessages';
import parseStop from './helper/parseStop';
import type {
  AllowedHafasProfile,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import type {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
  ParsedJourneyDetails,
} from 'types/HAFAS/JourneyDetails';

const parseJourneyDetails = (
  d: HafasResponse<JourneyDetailsResponse>,
  common: ParsedCommon,
): ParsedJourneyDetails => {
  const journey = d.svcResL[0].res.journey;
  const mainProduct = common.prodL[journey.prodX];
  adjustProductOperator(mainProduct, common, journey.stopL);

  const date = parse(journey.date, 'yyyyMMdd', new Date());
  if (!mainProduct.name) {
    mainProduct.name = `${mainProduct.type} ${mainProduct.number}`;
  }
  const stops = journey.stopL.map((stop) =>
    parseStop(stop, common, date, mainProduct),
  );
  const parsedJourney = {
    train: mainProduct,
    auslastung: parseAuslastung(journey.dTrnCmpSX, common.tcocL),
    jid: journey.jid,
    stops,
    firstStop: stops[0],
    lastStop: stops[stops.length - 1],
    messages: parseMessages(journey.msgL, common),
  };

  return parsedJourney as ParsedJourneyDetails;
};

export default async (
  jid: string,
  profile?: AllowedHafasProfile,
  raw?: boolean,
): Promise<ParsedJourneyDetails | undefined> => {
  const req: JourneyDetailsRequest = {
    req: { jid },
    meth: 'JourneyDetails',
  };

  try {
    const result = await makeRequest(
      req,
      raw ? undefined : parseJourneyDetails,
      profile,
    );
    return result;
  } catch {
    return undefined;
  }
};
