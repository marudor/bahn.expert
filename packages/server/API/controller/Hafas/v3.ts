import { Body, Controller, Post, Query, Request, Route, Tags } from 'tsoa';
import TripSearch from 'server/HAFAS/TripSearch';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Context } from 'koa';
import type { RoutingResult } from 'types/routing';
import type { TripSearchOptionsV3 } from 'types/HAFAS/TripSearch';

@Route('/hafas/v3')
export class HafasControllerV3 extends Controller {
  @Post('/tripSearch')
  @Tags('HAFAS')
  tripSearch(
    @Request() ctx: Context,
    @Body() body: TripSearchOptionsV3,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<RoutingResult<Date>> {
    return TripSearch(body, profile, ctx.query.raw);
  }
}
