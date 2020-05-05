import { Controller, Get, Hidden, Route, SuccessResponse, Tags } from 'tsoa';
import { wagenreihung, wagenreihungStation } from 'server/Reihung';
import { WRForNumber, WRForTZ } from 'server/Reihung/hasWR';
import TrainNames from 'server/Reihung/TrainNames';
import type { Formation, WagenreihungStation } from 'types/reihung';

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
    return Promise.resolve(TrainNames(tz)!);
  }

  @Hidden()
  @Get('/forTZ/{tz}')
  forTZ(tz: string) {
    return WRForTZ(tz);
  }

  @Hidden()
  @Get('/forNumber/{number}')
  forNumber(number: string) {
    return WRForNumber(number);
  }
}
