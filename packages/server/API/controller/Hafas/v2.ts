import { Body, Controller, Post, Query, Request, Route, Tags } from 'tsoa';
import TripSearch from 'server/HAFAS/TripSearch';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Context } from 'koa';
import type { RoutingResult } from 'types/routing';
import type { TripSearchOptionsV2 } from 'types/HAFAS/TripSearch';

@Route('/hafas/v2')
export class HafasControllerV2 extends Controller {
  @Post('/tripSearch')
  @Tags('HAFAS')
  tripSearch(
    @Request() ctx: Context,
    @Body() body: TripSearchOptionsV2,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<RoutingResult> {
    return TripSearch(body, profile, ctx.query.raw);
  }
}
