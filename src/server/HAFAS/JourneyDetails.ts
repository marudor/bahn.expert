import { HafasResponse, ParsedCommon } from 'types/HAFAS';
import {
  JourneyDetailsRequest,
  JourneyDetailsResponse,
} from 'types/HAFAS/JourneyDetails';
import makeRequest from './Request';

const parseJourneyDetails = (
  d: HafasResponse<JourneyDetailsResponse>,
  common: ParsedCommon
) => ({
  common,
  d,
});

export default (jid: string) => {
  const req: JourneyDetailsRequest = {
    req: { jid },
    meth: 'JourneyDetails',
  };

  return makeRequest(req, parseJourneyDetails);
};
