import { JourneyDetailsRequest } from 'types/HAFAS/JourneyDetails';
import makeRequest from './Request';

export default (jid: string) => {
  const req: JourneyDetailsRequest = {
    req: { jid },
    meth: 'JourneyDetails',
  };

  return makeRequest(req, d => d.svcResL[0].res);
};
