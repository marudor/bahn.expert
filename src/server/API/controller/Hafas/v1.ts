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
} from '@tsoa/runtime';
import { locMatch } from 'server/HAFAS/LocMatch';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import JourneyGeoPos from 'server/HAFAS/JourneyGeoPos';
import LocGeoPos from 'server/HAFAS/LocGeoPos';
import makeRequest from 'server/HAFAS/Request';
import PositionForTrain from 'server/HAFAS/PositionForTrain';
import type { AllowedHafasProfile, HafasStation } from 'types/HAFAS';
import type {
  JourneyGeoPosOptions,
  ParsedJourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';
import type { Request as KRequest } from 'koa';
import type { TsoaResponse } from '@tsoa/runtime';

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

  /**
   * Can be used to find all stopPlaces within a radius around a specific geo location
   */
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

  /**
   * Only uses this for non DB profiles. If you need DB stopPlace search use Operation tagged with StopPlace.
   * Used to search for stopPlaces based on a name.
   */
  @Get('/stopPlace/{searchTerm}')
  @Tags('HAFAS')
  @OperationId('StopPlaceSearch v1')
  stopPlaceSearch(
    @Request() req: KRequest,
    searchTerm: string,
    /**
     * S returns only StopPlaces, ALL also returns Point of Interests
     */
    @Query() type: 'S' | 'ALL' = 'S',
    @Query() profile?: AllowedHafasProfile,
  ): Promise<HafasStation[]> {
    // @ts-expect-error untyped
    return locMatch(searchTerm, type, profile, req.query.raw);
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

  /**
   * Used to find the position of a specific journey. Based on predictions, not GPS.
   *
   * @example trainName "ICE 23"
   * @example trainName "STR 1988"
   */
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
