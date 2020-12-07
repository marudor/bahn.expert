import { Controller, Get, OperationId, Route, Tags } from 'tsoa';
import { wagenreihung } from 'server/Reihung';
import type { Formation } from 'types/reihung';

@Route('/reihung/v2')
export class ReihungControllerV2 extends Controller {
  @Get('/wagen/{trainNumber}/{date}')
  @Tags('Reihung')
  @OperationId('Wagenreihung v2')
  wagenreihung(trainNumber: string, date: Date): Promise<Formation> {
    return wagenreihung(trainNumber, date);
  }
}
