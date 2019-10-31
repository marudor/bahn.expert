import { Controller, Get, Route, Tags } from 'tsoa';
import { getLageplan } from 'server/Bahnhof/Lageplan';
import { LageplanResponse } from 'types/bahnhof';

@Route('/bahnhof/v1')
export class BahnhofControllerV1 extends Controller {
  @Get('/lageplan/{stationName}')
  @Tags('Bahnhof V1')
  async lageplan(stationName: string): Promise<LageplanResponse> {
    return {
      lageplan: await getLageplan(stationName),
    };
  }
}
