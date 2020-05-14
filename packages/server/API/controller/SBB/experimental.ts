import { Body, Controller, Get, Post, Route, Tags } from 'tsoa';
import { RoutingOptions } from 'types/SBB/routing';
import { SBBStation } from 'types/SBB/station';
import Routing from 'server/SBB/Routing';
import StationSearch from 'server/SBB/StationSearch';

@Route('/sbb/experimental')
export class SBBExperimentalController extends Controller {
  @Get('/station/{searchTerm}')
  @Tags('SBB Experimental')
  station(searchTerm: string): Promise<SBBStation[]> {
    return StationSearch(searchTerm);
  }

  @Post('/routing')
  @Tags('SBB Experimental')
  routing(@Body() options: RoutingOptions): Promise<any> {
    return Routing(options);
  }
}
