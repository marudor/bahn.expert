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

  @Get('/runsPerDate/{date}')
  @Tags('Reihung')
  @OperationId('Runs per Date v4')
  async runsPerDate(
    date: Date,
    @Query() baureihen?: AvailableBR[],
    @Query() identifier?: AvailableIdentifier[],
    @Query() stopsAt?: EvaNumber[],
  ): Promise<TrainRunWithBR[]> {
    return getTrainRunsByDate(date, baureihen, identifier, stopsAt);
  }
}
