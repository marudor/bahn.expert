import { Controller, Deprecated, Get, OperationId, Route, Tags } from 'tsoa';
import { getLageplan } from 'server/StopPlace/Lageplan';
import type { EvaNumber } from 'types/common';
import type { LageplanResponse } from 'types/bahnhof';

@Route('/bahnhof/v1')
export class BahnhofControllerV1 extends Controller {
  @Get('/lageplan/{stopPlaceName}/{evaNumber}')
  @Tags('Bahnhof')
  @OperationId('Lageplan')
  @Deprecated()
  async lageplan(
    stopPlaceName: string,
    evaNumber: EvaNumber,
  ): Promise<LageplanResponse> {
    const lageplan = await getLageplan(stopPlaceName, evaNumber);
    return {
      lageplan,
    };
  }
}
