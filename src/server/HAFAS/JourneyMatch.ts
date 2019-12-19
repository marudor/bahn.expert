import { AllowedHafasProfile, HafasResponse, ParsedCommon } from 'types/HAFAS';
import { format, parse, subDays } from 'date-fns';
import {
  JourneyMatchRequest,
  JourneyMatchResponse,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import makeRequest from './Request';
import parseMessages from './helper/parseMessages';
import parseStop from './helper/parseStop';

const parseJourneyMatch = (
  d: HafasResponse<JourneyMatchResponse>,
  common: ParsedCommon
): ParsedJourneyMatchResponse[] => {
  return d.svcResL[0].res.jnyL.map(j => {
    const date = parse(j.date, 'yyyyMMdd', new Date());
    const train = common.prodL[j.prodX];
    const stops = j.stopL.map(stop => parseStop(stop, common, date, train));

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

export default (
  trainName: string,
  initialDepartureDate?: number,
  profile: AllowedHafasProfile = AllowedHafasProfile.db,
  raw?: boolean
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
      jnyFltrL: [
        {
          type: 'LID',
          value: 'A=1@L=80',
          mode: 'INC',
        },
      ],
    },
    meth: 'JourneyMatch',
  };

  return makeRequest(req, raw ? undefined : parseJourneyMatch, profile).catch(
    e => {
      if (e.errorCode === 'NO_MATCH') {
        e.status = 404;
      }
      throw e;
    }
  );
};
