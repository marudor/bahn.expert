import { coachSequence } from 'server/coachSequence';
import {
  Controller,
  Get,
  OperationId,
  Query,
  Route,
  Tags,
} from '@tsoa/runtime';
import { getPlannedSequence } from 'server/coachSequence/DB/plannedSequence';
import { getTrainRunsByDate } from 'server/coachSequence/DB/trainRuns';
import type {
  AvailableBR,
  AvailableIdentifier,
  CoachSequenceInformation,
} from 'types/coachSequence';
import type { EvaNumber } from 'types/common';
import type { TrainRunWithBR } from 'types/trainRuns';

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
    trainNumber: number,
    /**
     * Departure at the stop you want the coachSequence for
     */
    @Query() departure: Date,
    /** needed for OEBB Reihung, usually 7 digits */
    @Query() evaNumber?: EvaNumber,
    /** needed for OEBB Reihung */
    @Query() initialDeparture?: Date,
  ): Promise<CoachSequenceInformation | void> {
    try {
      const sequence = await coachSequence(
        trainNumber.toString(),
        departure,
        evaNumber,
        initialDeparture,
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
    this.setStatus(404);
  }

  /**
   * Returns all journeys that run on a specific date. Only works for DB Fernverkehr
   * @example stopsAt "[8000105, 8000191]"
   */
  @Get('/runsPerDate/{date}')
  @Tags('Reihung')
  @OperationId('Runs per Date v4')
  async runsPerDate(
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
    return getTrainRunsByDate(date, baureihen, identifier, stopsAt);
  }
}
