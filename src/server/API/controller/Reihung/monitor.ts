import { coachSequenceMonitoring } from 'server/coachSequence/monitoring';
import { Controller, Get, Hidden, Res, Route } from '@tsoa/runtime';
import type { CoachSequenceInformation } from 'types/coachSequence';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/reihung/monitoring')
export class ReihungMonitoringController extends Controller {
  @Get('/wagen')
  @Hidden()
  async monitoring(
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<CoachSequenceInformation> {
    const reihung = await coachSequenceMonitoring();

    if (!reihung) {
      return notFoundResponse(404);
    }

    return reihung;
  }
}
