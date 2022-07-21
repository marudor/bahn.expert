import { Controller, Get, OperationId, Route, Tags } from '@tsoa/runtime';
import { info } from 'oebb';
import type { EvaNumber } from 'types/common';

@Route('/oebb/experimental')
export class OEBBExperimentalController extends Controller {
  /** @isInt trainNumber */
  @Get('/trainInfo/{trainNumber}/{evaNumber}/{departureDate}')
  @Tags('OEBB')
  @OperationId('TrainInfo experimental')
  trainInfo(
    trainNumber: number,
    evaNumber: EvaNumber,
    departureDate: Date,
  ): ReturnType<typeof info> {
    return info(trainNumber, evaNumber, departureDate);
  }
}
