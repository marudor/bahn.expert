import { Controller, Get, Hidden, OperationId, Res, Route, Tags } from 'tsoa';
import { WRForNumber, WRForTZ } from 'server/Reihung/searchWR';
import TrainNames from '../../../coachSequence/TrainNames';
import type { CoachSequenceInformation } from 'types/coachSequence';
import type { TsoaResponse } from 'tsoa';

@Route('/reihung/v1')
export class ReihungControllerV1 extends Controller {
  @Get('/trainName/{tz}')
  @Tags('Reihung')
  @OperationId('Train Name v1')
  trainName(
    /**
     * TZ Number (e.g. 0169)
     */
    tz: string,
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<string> {
    const name = TrainNames(tz);
    if (!name) return notFoundResponse(404);
    return Promise.resolve(name);
  }

  @Hidden()
  @Get('/forTZ/{tz}')
  async forTZ(
    tz: string,
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<CoachSequenceInformation> {
    const reihung = await WRForTZ(tz);
    if (!reihung) return notFoundResponse(404);
    return reihung;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Hidden()
  @Get('/forNumber/{number}')
  async forNumber(
    number: string,
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<CoachSequenceInformation> {
    const reihung = await WRForNumber(number);
    if (!reihung) return notFoundResponse(404);
    return reihung;
  }
}
