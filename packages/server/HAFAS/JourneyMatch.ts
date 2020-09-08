import { AllowedHafasProfile } from 'types/HAFAS';
import { format, parse, subDays } from 'date-fns';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import makeRequest from './Request';
import parseMessages from './helper/parseMessages';
import parseStop from './helper/parseStop';
import type { HafasResponse, ParsedCommon } from 'types/HAFAS';
import type {
  JourneyMatchOptions,
  JourneyMatchRequest,
  JourneyMatchResponse,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';

const parseJourneyMatch = (
  d: HafasResponse<JourneyMatchResponse>,
  common: ParsedCommon,
): ParsedJourneyMatchResponse[] => {
  return d.svcResL[0].res.jnyL.map((j) => {
    const date = parse(j.date, 'yyyyMMdd', new Date());
    const train = common.prodL[j.prodX];
    const stops = j.stopL.map((stop) => parseStop(stop, common, date, train));

    return {
      train,
      stops,
      jid: j.jid,
      firstStop: stops[0],
      lastStop: stops[stops.length - 1],
      messages: parseMessages(j.msgL, common),
    };
  });
};

const JourneyMatch = (
  { trainName, initialDepartureDate, jnyFltrL }: JourneyMatchOptions,
  profile: AllowedHafasProfile = AllowedHafasProfile.DB,
  raw?: boolean,
): Promise<ParsedJourneyMatchResponse[]> => {
  let date = initialDepartureDate;

  if (!date) {
    const now = new Date();

    if (now.getHours() < 3) {
      date = subDays(now, 1).getTime();
    } else {
      date = now.getTime();
    }
  }

  const req: JourneyMatchRequest = {
    req: {
      date: format(date, 'yyyyMMdd'),
      input: trainName,
      jnyFltrL,
    },
    meth: 'JourneyMatch',
  };

  return makeRequest(req, raw ? undefined : parseJourneyMatch, profile).catch(
    (e) => {
      if (e.errorCode === 'NO_MATCH') {
        e.status = 404;
      }
      throw e;
    },
  );
};

export default JourneyMatch;

const fallbackTypeRegex = /(.+?)( |\d|\b).*\d+/;

export async function enrichedJourneyMatch(
  options: JourneyMatchOptions,
  profile?: AllowedHafasProfile,
): Promise<ParsedJourneyMatchResponse[]> {
  const journeyMatches = await JourneyMatch(options, profile);
  const limitedJourneyMatches = journeyMatches.slice(0, 3);

  for (let i = 0; i < limitedJourneyMatches.length; i++) {
    const j = limitedJourneyMatches[i];
    try {
      const details = await JourneyDetails(j.jid, profile);

      j.firstStop = details.firstStop;
      j.lastStop = details.lastStop;
      j.stops = details.stops;
      j.train = details.train;
    } catch {
      // ignore
    }

    if (!j.train.type) {
      j.train.type = fallbackTypeRegex.exec(j.train.name)?.[1];
    }
  }

  return limitedJourneyMatches;
}
