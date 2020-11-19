import {
  Body,
  Controller,
  Deprecated,
  OperationId,
  Post,
  Query,
  Request,
  Route,
  Tags,
} from 'tsoa';
import { isDate } from 'date-fns';
import TripSearch from 'server/HAFAS/TripSearch';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Context } from 'koa';
import type { RoutingResult } from 'types/routing';
import type {
  TripSearchOptionsV2,
  TripSearchOptionsV3,
} from 'types/HAFAS/TripSearch';

function convertDateToEpoch(o: any) {
  if (!o) return;
  if (Array.isArray(o)) {
    o.forEach(convertDateToEpoch);
  } else if (o.constructor === Object) {
    for (const [key, value] of Object.entries(o)) {
      convertDateToEpoch(value);
      if (isDate(value)) {
        // @ts-expect-error this is type unsafe
        o[key] = value.getTime();
      }
    }
  }
}

@Route('/hafas/v2')
export class HafasControllerV2 extends Controller {
  @Post('/tripSearch')
  @Tags('HAFAS')
  @Deprecated()
  @OperationId('TripSearch Deprecated')
  async tripSearchV2(
    @Request() ctx: Context,
    @Body() body: TripSearchOptionsV2,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<RoutingResult<number>> {
    // @ts-expect-error actual conversion happens right after this line
    const v3Body: TripSearchOptionsV3 = body;
    if (body.time) {
      v3Body.time = new Date(body.time);
    }

    const v3TripSearch = await TripSearch(v3Body, profile, ctx.query.raw);
    convertDateToEpoch(v3TripSearch);
    // @ts-expect-error we just converted it - type unsafe
    return v3TripSearch;
  }
}
