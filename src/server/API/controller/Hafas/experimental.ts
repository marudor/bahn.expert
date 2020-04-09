import { AbfahrtenResult } from 'types/iris';
import { AllowedHafasProfile } from 'types/HAFAS';
import { ArrivalStationBoardEntry } from 'types/stationBoard';
import { Body, Controller, Get, Post, Query, Request, Route, Tags } from 'tsoa';
import { Context } from 'koa';
import {
  HimSearchRequestOptions,
  ParsedHimSearchResponse,
} from 'types/HAFAS/HimSearch';
import { JourneyCourseRequestOptions } from 'types/HAFAS/JourneyCourse';
import { JourneyGraphRequestOptions } from 'types/HAFAS/JourneyGraph';
import { JourneyTreeRequestOptions } from 'types/HAFAS/JourneyTree';
import HimSearch from 'server/HAFAS/HimSearch';
import JourneyCourse from 'server/HAFAS/JourneyCourse';
import JourneyGraph from 'server/HAFAS/JourneyGraph';
import JourneyTree from 'server/HAFAS/JourneyTree';
import StationBoard from 'server/HAFAS/StationBoard';
import StationBoardToTimetables from 'server/HAFAS/StationBoard/StationBoardToTimetables';

@Route('/hafas/experimental')
export class HafasExperimentalController extends Controller {
  @Get('/himMessages')
  @Tags('HAFAS Experimental')
  himMessages(
    @Request() ctx: Context,
    @Query() himIds: string[],
    @Query() profile?: AllowedHafasProfile
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
      ctx.query.raw
    );
  }

  @Post('/HimSearch')
  @Tags('HAFAS Experimental')
  himSearch(
    @Request() ctx: Context,
    @Body() options: HimSearchRequestOptions,
    @Query() profile?: AllowedHafasProfile
  ) {
    return HimSearch(options, profile, ctx.query.raw);
  }

  @Get('/irisCompatibleAbfahrten/{evaId}')
  @Tags('HAFAS Experimental')
  async irisCompatibleAbfahrten(
    evaId: string,
    @Query() profile?: AllowedHafasProfile
  ): Promise<AbfahrtenResult> {
    const hafasDeparture = await StationBoard(
      {
        type: 'DEP',
        station: evaId,
      },
      profile
    );
    const hafasArrivals = await StationBoard(
      {
        type: 'ARR',
        station: evaId,
      },
      profile
    ).catch(() => undefined);

    const mappedHafasArrivals =
      hafasArrivals?.reduce(
        (
          map: {
            [key: string]: ArrivalStationBoardEntry;
          },
          arrival
        ) => {
          map[`${arrival.jid}${arrival.train.number}`] = arrival;

          return map;
        },
        {}
      ) || {};

    return {
      lookbehind: [],
      departures: hafasDeparture
        .slice(0, 60)
        .map((departure) =>
          StationBoardToTimetables(departure, mappedHafasArrivals)
        )
        .filter((Boolean as any) as ExcludesFalse),
      wings: {},
    };
  }

  @Post('/JourneyTree')
  @Tags('HAFAS Experimental')
  JourneyTree(
    @Body() options: JourneyTreeRequestOptions,
    @Query() profile?: AllowedHafasProfile
  ) {
    return JourneyTree(options, profile);
  }

  @Post('/JourneyGraph')
  @Tags('HAFAS Experimental')
  JourneyGraph(
    @Body() options: JourneyGraphRequestOptions,
    @Query() profile?: AllowedHafasProfile
  ) {
    return JourneyGraph(options, profile);
  }

  @Post('/JourneyCourse')
  @Tags('HAFAS Experimental')
  JourneyCourse(
    @Request() ctx: Context,
    @Body() options: JourneyCourseRequestOptions,
    @Query() profile?: AllowedHafasProfile
  ) {
    return JourneyCourse(options, profile, ctx.query.raw);
  }
}
