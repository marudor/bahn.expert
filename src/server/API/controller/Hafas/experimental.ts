import { AbfahrtenResult } from 'types/iris';
import { AllowedHafasProfile } from 'types/HAFAS';
import { Body, Controller, Get, Post, Query, Route, Tags } from 'tsoa';
import { JourneyCourseRequestOptions } from 'types/HAFAS/JourneyCourse';
import { JourneyGraphRequestOptions } from 'types/HAFAS/JourneyGraph';
import { JourneyTreeRequestOptions } from 'types/HAFAS/JourneyTree';
import { ParsedHimSearchResponse } from 'types/HAFAS/HimSearch';
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
    @Query() himIds: string[],
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedHimSearchResponse> {
    return HimSearch(
      {
        himFltrL: himIds.map(value => ({
          type: 'HIMID',
          mode: 'INC',
          value,
        })),
      },
      profile
    );
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

    return {
      lookbehind: [],
      departures: hafasDeparture
        .map(StationBoardToTimetables)
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
    @Body() options: JourneyCourseRequestOptions,
    @Query() profile?: AllowedHafasProfile
  ) {
    return JourneyCourse(options, profile);
  }
}
