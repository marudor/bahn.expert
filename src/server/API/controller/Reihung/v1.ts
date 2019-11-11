import { Controller, Get, Route, Tags } from 'tsoa';
import { Formation, WagenreihungStation } from 'types/reihung';
import { wagenreihung, wagenreihungStation } from 'server/Reihung';
@Route('/reihung/v1')
export class ReihungControllerV1 extends Controller {
  @Get('/wagenstation/{train}/{station}')
  @Tags('Reihung V1')
  planWagenreihung(
    train: string,
    station: string
  ): Promise<WagenreihungStation> {
    return wagenreihungStation([train], station);
  }

  @Get('/wagen/{trainNumber}/{date}')
  @Tags('Reihung V1')
  wagenreihung(
    trainNumber: string,
    /**
     * Unix Time (ms)
     */
    date: number
  ): Promise<Formation> {
    return wagenreihung(trainNumber, date);
  }
}
