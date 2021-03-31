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
import { enrichedJourneyMatch } from 'server/HAFAS/JourneyMatch';
import JourneyGeoPos from 'server/HAFAS/JourneyGeoPos';
import LocGeoPos from 'server/HAFAS/LocGeoPos';
import LocMatch from 'server/HAFAS/LocMatch';
import makeRequest from 'server/HAFAS/Request';
import PositionForTrain from 'server/HAFAS/PositionForTrain';
import type { AllowedHafasProfile, HafasStation } from 'types/HAFAS';
import type { Context } from 'koa';
import type {
  JourneyGeoPosOptions,
  ParsedJourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';
import type {
  JourneyMatchOptions,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';

@Route('/hafas/v1')
export class HafasController extends Controller {
  @Post('/enrichedJourneyMatch')
  @Hidden()
  enrichedJourneyMatch(
    @Body() options: JourneyMatchOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyMatchResponse[]> {
    return enrichedJourneyMatch(options, profile);
  }

  @Get('/geoStation')
  @Tags('HAFAS')
  @OperationId('Geo Station v1')
  geoStation(
    @Request() ctx: Context,
    @Query() lat: number,
    @Query() lng: number,
    @Query() maxDist = 1000,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<HafasStation[]> {
    return LocGeoPos(
      lng * 1000000,
      lat * 1000000,
      maxDist,
      profile,
      ctx.query.raw,
    );
  }

  @Get('/station/{searchTerm}')
  @Tags('HAFAS')
  @Hidden()
  station(
    @Request() ctx: Context,
    searchTerm: string,
    @Query() type?: 'S' | 'ALL',
    @Query() profile?: AllowedHafasProfile,
  ): Promise<HafasStation[]> {
    return LocMatch(searchTerm, type, profile, ctx.query.raw);
  }

  @Post('/journeyGeoPos')
  @Tags('HAFAS')
  @OperationId('Journey Geo Position v1')
  journeyGeoPos(
    @Request() ctx: Context,
    @Body() body: JourneyGeoPosOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyGeoPosResponse> {
    return JourneyGeoPos(body, profile, ctx.query.raw);
  }

  @Get('/positionForTrain/{trainName}')
  @Tags('HAFAS')
  @OperationId('Position for Train v1')
  async positionForTrain(
    trainName: string,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyGeoPosResponse> {
    const result = await PositionForTrain(trainName, profile);

    if (!result) {
      throw {
        status: 404,
      };
    }

    return result;
  }

  @Hidden()
  @Post('/rawHafas')
  rawHafas(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Body() body: any,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<any> {
    return makeRequest(body, undefined, profile);
  }
}
