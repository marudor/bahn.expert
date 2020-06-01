import { Body, Controller, Get, Post, Route, Tags } from 'tsoa';
import { routing, stationSearch } from 'sbb';
import { RoutingOptions } from 'sbb/types/routing';
import { SBBStation } from 'sbb/types/station';

@Route('/sbb/experimental')
export class SBBExperimentalController extends Controller {
  @Get('/station/{searchTerm}')
  @Tags('SBB Experimental')
  station(searchTerm: string): Promise<SBBStation[]> {
    return stationSearch(searchTerm);
  }

  @Post('/routing')
  @Tags('SBB Experimental')
  routing(@Body() options: RoutingOptions): Promise<any> {
    return routing(options);
  }
}
