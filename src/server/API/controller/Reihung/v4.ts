import { coachSequence } from '@/server/coachSequence';
import {
  Controller,
  Get,
  OperationId,
  Query,
  Res,
  Route,
  Tags,
} from '@tsoa/runtime';
import { getPlannedSequence } from '@/server/coachSequence/DB/plannedSequence';
import type { CoachSequenceInformation } from '@/types/coachSequence';
import type { EvaNumber } from '@/types/common';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/reihung/v4')
export class ReihungControllerV4 extends Controller {
  /**
   * Returns the coachSequence at a specific stop for a specific train.
   * Works for OEBB stops and DB stops.
   *
   * Returns plannedSequence if no real time information is available
   * @isInt trainNumber
   * @example trainNumber "23"
   * @example trainNumber "42023"
   */
  @Get('/wagen/{trainNumber}')
  @Tags('Reihung')
  @OperationId('Wagenreihung v4')
  async wagenreihung(
    @Res() notFoundResponse: TsoaResponse<404, void>,
    trainNumber: number,
    /**
     * Departure at the stop you want the coachSequence for
     */
    @Query() departure: Date,
    /** needed for OEBB Reihung, usually 7 digits */
    @Query() evaNumber?: EvaNumber,
    /** needed for OEBB Reihung */
    @Query() initialDeparture?: Date,
    /** needed for new DB Reihung */
    @Query() category?: string,
    /** needed for new DB Navigator Reihung */
    @Query() administration?: string,
  ): Promise<CoachSequenceInformation | void> {
    try {
      const sequence = await coachSequence(
        trainNumber.toString(),
        departure,
        evaNumber,
        initialDeparture,
        category,
        administration,
      );
      if (sequence) return sequence;
    } catch {
      // we ignore this
    }

    if (trainNumber < 10000 && evaNumber) {
      const plannedSequence = await getPlannedSequence(
        trainNumber,
        initialDeparture ?? departure,
        evaNumber,
      );
      if (plannedSequence) {
        return plannedSequence;
      }
    }
    return notFoundResponse(404);
  }
}
