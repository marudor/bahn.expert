import {
  Controller,
  Deprecated,
  Get,
  OperationId,
  Res,
  Route,
  Tags,
} from '@tsoa/runtime';
import TrainNames from '../../../coachSequence/TrainNames';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/reihung/v1')
export class ReihungControllerV1 extends Controller {
  @Deprecated()
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
}
