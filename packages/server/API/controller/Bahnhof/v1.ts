import { Controller, Get, Route, Tags } from 'tsoa';
import { getBayernLageplan } from 'server/Bahnhof/LageplanBayern';
import { getLageplan } from 'server/Bahnhof/Lageplan';
import type { LageplanResponse } from 'types/bahnhof';

@Route('/bahnhof/v1')
export class BahnhofControllerV1 extends Controller {
  @Get('/lageplan/{stationName}/{evaId}')
  @Tags('Bahnhof V1')
  async lageplan(
    stationName: string,
    evaId: string
  ): Promise<LageplanResponse> {
    const lageplan =
      getBayernLageplan(evaId) || (await getLageplan(stationName));
    return {
      lageplan,
    };
  }
}
