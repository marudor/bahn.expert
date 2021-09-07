import { coachSequence } from 'oebb';
import { Controller, Get, OperationId, Route, Tags } from '@tsoa/runtime';
import type { EvaNumber } from 'types/common';

@Route('/oebb/experimental')
export class OEBBExperimentalController extends Controller {
  @Get('/coachSequence/{trainName}/{evaNumber}/{departureDate}')
  @Tags('OEBB')
  @OperationId('Wagenreihung experimental')
  wagenreihung(
    trainName: string,
    evaNumber: EvaNumber,
    departureDate: Date,
  ): ReturnType<typeof coachSequence> {
    return coachSequence(trainName, evaNumber, departureDate);
  }
}
