import { Controller, Deprecated, Get, Route, Tags } from 'tsoa';
import { getBayernLageplan } from 'server/Bahnhof/LageplanBayern';
import { getLageplan } from 'server/Bahnhof/Lageplan';
import type { LageplanResponse } from 'types/bahnhof';

@Route('/bahnhof/v1')
export class BahnhofControllerV1 extends Controller {
  @Deprecated()
  @Get('/lageplan/{stationName}')
  @Tags('Bahnhof V1')
  async lageplan(stationName: string): Promise<LageplanResponse> {
    return {
      lageplan: await getLageplan(stationName),
    };
  }

  @Get('/lageplan/{stationName}/{evaId}')
  @Tags('Bahnhof V1')
  async lageplanWithBayern(
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
