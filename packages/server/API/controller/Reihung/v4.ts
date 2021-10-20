import { coachSequence } from 'server/coachSequence';
import {
  Controller,
  Get,
  OperationId,
  Query,
  Route,
  Tags,
} from '@tsoa/runtime';
import type { CoachSequenceInformation } from 'types/coachSequence';
import type { EvaNumber } from 'types/common';

@Route('/reihung/v4')
export class ReihungControllerV4 extends Controller {
  /**
   * @isInt trainNumber */
  @Get('/wagen/{trainNumber}')
  @Tags('Reihung')
  @OperationId('Wagenreihung v4')
  async wagenreihung(
    trainNumber: number,
    @Query() departure: Date,
    /** needed for OEBB Reihung, usually 7 digits */
    @Query() evaNumber?: EvaNumber,
    /** needed for OEBB Reihung */
    @Query() initialDeparture?: Date,
  ): Promise<CoachSequenceInformation> {
    const sequence = await coachSequence(
      trainNumber.toString(),
      departure,
      evaNumber,
      initialDeparture,
    );
    if (!sequence) {
      throw {
        status: 404,
      };
    }
    return sequence;
  }
}
