import { coachSequence } from '@/server/coachSequence';
import {
  Controller,
  Get,
  OperationId,
  Query,
  Request,
  Res,
  Route,
  Tags,
} from '@tsoa/runtime';
import { getPlannedSequence } from '@/server/coachSequence/DB/plannedSequence';
import { getTrainRunsByDate } from '@/server/coachSequence/DB/trainRuns';
import { isAllowed } from '@/server/API/controller/journeys/v1';
import type {
  AvailableBR,
  AvailableIdentifier,
  CoachSequenceInformation,
} from '@/types/coachSequence';
import type { EvaNumber } from '@/types/common';
import type { Request as KoaRequest } from 'koa';
import type { TrainRunWithBR } from '@/types/trainRuns';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/coachSequence/v4')
export class CoachSequenceControllerV4 extends Controller {
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
  @Tags('CoachSequence')
  @OperationId('CoachSequence v4')
  async coachSequence(
    @Request() req: KoaRequest,
    @Res() response: TsoaResponse<401 | 404, void | string>,
    trainNumber: number,
    /**
     * Departure at the stop you want the coachSequence for
     */
    @Query() departure: Date,
    /** needed for OEBB coachSequence, usually 7 digits */
    @Query() evaNumber?: EvaNumber,
    /** needed for OEBB coachSequence */
    @Query() initialDeparture?: Date,
    /** needed for new DB coachSequence */
    @Query() category?: string,
    /** needed for new DB Navigator coachSequence */
    @Query() administration?: string,
    /** needed for SBB coachSequence */
    @Query() lastArrivalEva?: string,
  ): Promise<CoachSequenceInformation | void> {
    if (!isAllowed(req)) {
      return response(
        401,
        'This is heavily rate-limited upstream, please do not use it.',
      );
    }
    try {
      const sequence = await coachSequence(
        trainNumber.toString(),
        departure,
        evaNumber,
        initialDeparture,
        category,
        administration,
        lastArrivalEva,
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
    return response(404);
  }

  /**
   * Returns all journeys that run on a specific date. Only works for DB Fernverkehr
   * @example stopsAt "[8000105, 8000191]"
   */
  @Get('/runsPerDate/{date}')
  @Tags('CoachSequence')
  @OperationId('Runs per Date v4')
  async runsPerDate(
    @Request() req: KoaRequest,
    @Res() response: TsoaResponse<401, void | string>,
    date: Date,
    /**
     * Used to filter for specific Baureihen
     */
    @Query() baureihen?: AvailableBR[],
    /**
     * Used to filter for specific identifier (identifier are defined by me, not DB)
     */
    @Query() identifier?: AvailableIdentifier[],
    /**
     * Used to filter for runs that stop at specific stopPlaces in the specifed order
     */
    @Query() stopsAt?: EvaNumber[],
  ): Promise<TrainRunWithBR[]> {
    if (!isAllowed(req)) {
      return response(
        401,
        'This is heavily rate-limited upstream, please do not use it.',
      );
    }
    return getTrainRunsByDate(date, baureihen, identifier, stopsAt);
  }
}
