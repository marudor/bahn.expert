import {
  Body,
  Controller,
  Get,
  Hidden,
  OperationId,
  Post,
  Query,
  Request,
  Route,
  Tags,
} from 'tsoa';
import HimSearch from 'server/HAFAS/HimSearch';
import JourneyCourse from 'server/HAFAS/JourneyCourse';
import JourneyGraph from 'server/HAFAS/JourneyGraph';
import JourneyTree from 'server/HAFAS/JourneyTree';
import StationBoard from 'server/HAFAS/StationBoard';
import StationBoardToTimetables from 'server/HAFAS/StationBoard/StationBoardToTimetables';
import type { AbfahrtenResult } from 'types/iris';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { ArrivalStationBoardEntry } from 'types/stationBoard';
import type { Context } from 'koa';
import type {
  HimSearchRequestOptions,
  ParsedHimSearchResponse,
} from 'types/HAFAS/HimSearch';
import type { JourneyCourseRequestOptions } from 'types/HAFAS/JourneyCourse';
import type { JourneyGraphRequestOptions } from 'types/HAFAS/JourneyGraph';
import type { JourneyTreeRequestOptions } from 'types/HAFAS/JourneyTree';

@Route('/hafas/experimental')
export class HafasExperimentalController extends Controller {
  @Get('/himMessages')
  @Tags('HAFAS Experimental')
  @OperationId('Him Messages')
  himMessages(
    @Request() ctx: Context,
    @Query() himIds: string[],
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedHimSearchResponse> {
    return HimSearch(
      {
        himFltrL: himIds.map((value) => ({
          type: 'HIMID',
          mode: 'INC',
          value,
        })),
      },
      profile,
      // @ts-expect-error untyped
      ctx.query.raw,
    );
  }

  @Post('/HimSearch')
  @Tags('HAFAS Experimental')
  @OperationId('Him Search')
  himSearch(
    @Request() ctx: Context,
    @Body() options: HimSearchRequestOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedHimSearchResponse> {
    // @ts-expect-error untyped
    return HimSearch(options, profile, ctx.query.raw);
  }

  @Get('/irisCompatibleAbfahrten/{evaId}')
  @Tags('HAFAS Experimental')
  @Hidden()
  async irisCompatibleAbfahrten(
    evaId: string,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<AbfahrtenResult> {
    const hafasDeparture = await StationBoard(
      {
        type: 'DEP',
        station: evaId,
      },
      profile,
    );
    const hafasArrivals = await StationBoard(
      {
        type: 'ARR',
        station: evaId,
      },
      profile,
    ).catch(() => undefined);

    const mappedHafasArrivals =
      hafasArrivals?.reduce(
        (
          map: {
            [key: string]: ArrivalStationBoardEntry;
          },
          arrival,
        ) => {
          map[`${arrival.jid}${arrival.train.number}`] = arrival;

          return map;
        },
        {},
      ) || {};

    const idSet = new Set<string>();

    return {
      lookbehind: [],
      departures: hafasDeparture
        .map((departure) =>
          StationBoardToTimetables(departure, mappedHafasArrivals, idSet),
        )
        .filter((Boolean as unknown) as ExcludesFalse)
        .slice(0, 75),
      wings: {},
    };
  }

  @Post('/JourneyTree')
  @Tags('HAFAS Experimental')
  @OperationId('Journey Tree')
  JourneyTree(
    @Body() options: JourneyTreeRequestOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<any> {
    return JourneyTree(options, profile);
  }

  @Post('/JourneyGraph')
  @Tags('HAFAS Experimental')
  @OperationId('Journey Graph')
  JourneyGraph(
    @Body() options: JourneyGraphRequestOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<any> {
    return JourneyGraph(options, profile);
  }

  @Post('/JourneyCourse')
  @Tags('HAFAS Experimental')
  @OperationId('Journey Course')
  JourneyCourse(
    @Request() ctx: Context,
    @Body() options: JourneyCourseRequestOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<any> {
    // @ts-expect-error untyped
    return JourneyCourse(options, profile, ctx.query.raw);
  }
}
