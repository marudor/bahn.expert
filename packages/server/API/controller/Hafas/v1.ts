import {
  Body,
  Controller,
  Get,
  Hidden,
  OperationId,
  Post,
  Query,
  Request,
  Res,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import { enrichedJourneyMatch } from 'server/HAFAS/JourneyMatch';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import JourneyGeoPos from 'server/HAFAS/JourneyGeoPos';
import LocGeoPos from 'server/HAFAS/LocGeoPos';
import LocMatch from 'server/HAFAS/LocMatch';
import makeRequest from 'server/HAFAS/Request';
import PositionForTrain from 'server/HAFAS/PositionForTrain';
import type { AllowedHafasProfile, HafasStation } from 'types/HAFAS';
import type {
  EnrichedJourneyMatchOptions,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import type {
  JourneyGeoPosOptions,
  ParsedJourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';
import type { Request as KRequest } from 'koa';
import type { TsoaResponse } from 'tsoa';

@Route('/hafas/v1')
export class HafasController extends Controller {
  /**
   * This redirects to the current Details Page with a provided HAFAS TripId / JourneyId / JID
   */
  @SuccessResponse(302)
  @Response(500, 'Failed to fetch a journey for this tripId')
  @Tags('HAFAS')
  @Get('/detailsRedirect/{tripId}')
  async detailsRedirect(
    tripId: string,
    @Res() res: TsoaResponse<302, void>,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<void> {
    const hafasDetails = await JourneyDetails(tripId);

    const trainName = `${hafasDetails.train.type} ${hafasDetails.train.number}`;
    const evaNumber = hafasDetails.stops[0].station.id;
    const date = hafasDetails.stops[0].departure?.scheduledTime;
    const dataUrlPart = date?.toISOString() || '';
    const profileUrlPart = profile ? `&profile=${profile}` : '';

    res(302, undefined, {
      location: `/details/${trainName}/${dataUrlPart}?stopEva=${evaNumber}${profileUrlPart}`,
    });
  }

  @Post('/enrichedJourneyMatch')
  @Hidden()
  enrichedJourneyMatch(
    @Body() options: EnrichedJourneyMatchOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyMatchResponse[]> {
    return enrichedJourneyMatch(options, profile);
  }

  @Get('/geoStation')
  @Tags('HAFAS')
  @OperationId('Geo Station v1')
  geoStation(
    @Request() req: KRequest,
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
      // @ts-expect-error untyped
      req.query.raw,
    );
  }

  @Get('/station/{searchTerm}')
  @Tags('HAFAS')
  @Hidden()
  station(
    @Request() req: KRequest,
    searchTerm: string,
    @Query() type?: 'S' | 'ALL',
    @Query() profile?: AllowedHafasProfile,
  ): Promise<HafasStation[]> {
    // @ts-expect-error untyped
    return LocMatch(searchTerm, type, profile, req.query.raw);
  }

  @Post('/journeyGeoPos')
  @Tags('HAFAS')
  @OperationId('Journey Geo Position v1')
  journeyGeoPos(
    @Request() req: KRequest,
    @Body() body: JourneyGeoPosOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyGeoPosResponse> {
    // @ts-expect-error untyped
    return JourneyGeoPos(body, profile, req.query.raw);
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
