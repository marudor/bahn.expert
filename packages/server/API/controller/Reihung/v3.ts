import {
  Controller,
  Deprecated,
  Get,
  OperationId,
  Query,
  Route,
  Tags,
} from '@tsoa/runtime';
import { info } from 'oebb';
import { OEBBToDB } from 'server/Reihung/OEBBToDB';
import { wagenreihung } from 'server/Reihung';
import type { EvaNumber } from 'types/common';
import type { Formation } from 'types/reihung';

@Route('/reihung/v3')
export class ReihungControllerV3 extends Controller {
  /**
   * @isInt trainNumber */
  @Get('/wagen/{trainNumber}')
  @Tags('Reihung')
  @OperationId('Wagenreihung v3')
  @Deprecated()
  async wagenreihung(
    trainNumber: number,
    @Query() departure: Date,
    /** needed for OEBB Reihung, usually 7 digits */
    @Query() evaNumber?: EvaNumber,
    /** needed for OEBB Reihung */
    @Query() initialDeparture?: Date,
  ): Promise<Formation> {
    if (evaNumber && initialDeparture && !evaNumber.startsWith('80')) {
      const oebbReihung = await info(trainNumber, evaNumber, initialDeparture);
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
    return wagenreihung(trainNumber.toString(), departure);
  }
}
