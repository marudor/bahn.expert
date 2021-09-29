import { coachSequence } from 'oebb';
import {
  Controller,
  Get,
  OperationId,
  Query,
  Route,
  Tags,
} from '@tsoa/runtime';
import { OEBBToDB } from 'server/Reihung/OEBBToDB';
import { wagenreihung } from 'server/Reihung';
import type { EvaNumber } from 'types/common';
import type { Formation } from 'types/reihung';

@Route('/reihung/v3')
export class ReihungControllerV3 extends Controller {
  @Get('/wagen/{trainName}')
  @Tags('Reihung')
  @OperationId('Wagenreihung v3')
  async wagenreihung(
    /** TrainType and Number eg ICE 23 */
    trainName: string,
    @Query() departure: Date,
    @Query() evaNumber?: EvaNumber,
    @Query() initialDeparture?: Date,
  ): Promise<Formation> {
    const trainNumber = trainName.split(' ').pop();
    if (evaNumber && initialDeparture && !evaNumber.startsWith('80')) {
      const oebbReihung = await coachSequence(
        trainName,
        evaNumber,
        initialDeparture,
      );
      if (oebbReihung) {
        const mappedReihung = OEBBToDB(oebbReihung);
        if (mappedReihung) return mappedReihung;
      }
    }
    if (!trainNumber) {
      throw {
        status: 404,
      };
    }
    return wagenreihung(trainNumber, departure);
  }
}
