import {
  Body,
  Controller,
  OperationId,
  Post,
  Query,
  Request,
  Route,
  Tags,
} from '@tsoa/runtime';
import TripSearch from 'server/HAFAS/TripSearch';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Request as KRequest } from 'koa';
import type { RoutingResult } from 'types/routing';
import type { TripSearchOptionsV3 } from 'types/HAFAS/TripSearch';

@Route('/hafas/v3')
export class HafasControllerV3 extends Controller {
  /**
   * Used to find trips [Verbindungssuche]
   * A lot of the request options are raw HAFAS and not documented.
   */
  @Post('/tripSearch')
  @Tags('HAFAS')
  @OperationId('TripSearch v3')
  tripSearch(
    @Request() req: KRequest,
    @Body() body: TripSearchOptionsV3,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<RoutingResult> {
    // @ts-expect-error untyped
    return TripSearch(body, profile, req.query.raw);
  }
}
