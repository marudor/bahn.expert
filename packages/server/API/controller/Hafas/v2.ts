import { AllowedHafasProfile } from 'types/HAFAS';
import { Body, Controller, Post, Query, Request, Route, Tags } from 'tsoa';
import { Context } from 'koa';
import { TripSearchOptionsV2 } from 'types/HAFAS/TripSearch';
import TripSearch from 'server/HAFAS/TripSearch';

@Route('/hafas/v2')
export class HafasControllerV2 extends Controller {
  @Post('/tripSearch')
  @Tags('HAFAS')
  tripSearch(
    @Request() ctx: Context,
    @Body() body: TripSearchOptionsV2,
    @Query() profile?: AllowedHafasProfile,
  ) {
    return TripSearch(body, profile, ctx.query.raw);
  }
}
