import { Controller, Get, OperationId, Route, Tags } from 'tsoa';
import { getLageplan } from 'server/Bahnhof/Lageplan';
import type { LageplanResponse } from 'types/bahnhof';

@Route('/bahnhof/v1')
export class BahnhofControllerV1 extends Controller {
  @Get('/lageplan/{stationName}/{evaId}')
  @Tags('Bahnhof')
  @OperationId('Lageplan v1')
  async lageplan(
    stationName: string,
    evaId: string,
  ): Promise<LageplanResponse> {
    const lageplan = await getLageplan(stationName, evaId);
    return {
      lageplan,
    };
  }
}
