import { coachSequence } from 'oebb';
import { Controller, Get, OperationId, Query, Route, Tags } from 'tsoa';
import { OEBBToDB } from 'server/Reihung/OEBBToDB';
import { wagenreihung } from 'server/Reihung';
import type { Formation } from 'types/reihung';

@Route('/reihung/v2')
export class ReihungControllerV2 extends Controller {
  @Get('/wagen/{trainNumber}/{date}')
  @Tags('Reihung')
  @OperationId('Wagenreihung v2')
  async wagenreihung(
    trainNumber: string,
    date: Date,
    @Query() trainType?: string,
    @Query() evaNumber?: string,
  ): Promise<Formation> {
    if (trainType && evaNumber?.startsWith('81')) {
      const oebbReihung = await coachSequence(
        `${trainType} ${trainNumber}`,
        evaNumber,
        date,
      );
      if (oebbReihung) {
        const mappedReihung = OEBBToDB(oebbReihung);
        if (mappedReihung) return mappedReihung;
      }
    }
    return wagenreihung(trainNumber, date);
  }
}
