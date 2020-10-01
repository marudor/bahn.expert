import { Controller, Get, Route, Tags } from 'tsoa';
import { getCoachSequence } from 'oebb';
import type { OebbReihung } from 'oebb';

@Route('/oebb/experimental')
export class OEBBExperimentalController extends Controller {
  @Get('/coachsequence/{trainName}/{evaId}/{date}')
  @Tags('OEBB Experimental')
  async coachSequence(
    trainName: string,
    evaId: string,
    date: number,
  ): Promise<OebbReihung> {
    const coachSequence = await getCoachSequence(trainName, evaId, date);
    if (!coachSequence) {
      throw {
        status: 404,
      };
    }
    return coachSequence;
  }
}
