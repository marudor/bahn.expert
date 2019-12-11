import { Controller, Get, Route, SuccessResponse, Tags } from 'tsoa';
import { Formation, WagenreihungStation } from 'types/reihung';
import { wagenreihung, wagenreihungStation } from 'server/Reihung';
import ICENaming from 'server/Reihung/ICENaming';

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

  @SuccessResponse(200, 'Train name. May be undefined')
  @Get('/trainName/{tz}')
  @Tags('Reihung V1')
  trainName(
    /**
     * TZ Number (e.g. 0169)
     */
    tz?: string
  ): Promise<string> {
    // @ts-ignore
    return Promise.resolve(ICENaming(tz));
  }
}
