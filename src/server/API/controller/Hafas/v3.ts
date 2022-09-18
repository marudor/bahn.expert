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
  Route,
  Tags,
} from '@tsoa/runtime';
import Detail from 'server/HAFAS/Detail';
import TripSearch from 'server/HAFAS/TripSearch';
import type { AdditionalJourneyInformation } from 'types/HAFAS/JourneyDetails';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { EvaNumber } from 'types/common';
import type { Request as KRequest } from 'koa';
import type { Route$Auslastung, RoutingResult } from 'types/routing';
import type { TripSearchOptionsV3 } from 'types/HAFAS/TripSearch';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/hafas/v3')
export class HafasControllerV3 extends Controller {
  /**
   * Used to find trips [Verbindungssuche]
   * A lot of the request options are raw HAFAS and not documented.
   */
  @Post('/tripSearch')
  @Tags('HAFAS')
  @OperationId('TripSearch v3')
  tripSearch(
    @Request() req: KRequest,
    @Body() body: TripSearchOptionsV3,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<RoutingResult> {
    // @ts-expect-error untyped
    return TripSearch(body, profile, req.query.raw);
  }

  @Hidden()
  @Get('/additionalInformation/{trainName}')
  @Tags('HAFAS')
  @OperationId('Additional Information')
  async additionalInformation(
    @Res() notFoundResponse: TsoaResponse<404, void>,
    trainName: string,
    @Query() evaNumberAlongRoute?: string,
    @Query() initialDepartureDate?: Date,
  ): Promise<AdditionalJourneyInformation> {
    const journeyDetails = await Detail(
      trainName,
      undefined,
      evaNumberAlongRoute,
      initialDepartureDate,
    );
    if (!journeyDetails) {
      return notFoundResponse(404);
    }
    const occupancy: Record<EvaNumber, Route$Auslastung> = {};
    for (const stop of journeyDetails.stops) {
      if (stop.auslastung) {
        occupancy[stop.station.id] = stop.auslastung;
      }
    }
    if (journeyDetails.train.operator || Object.keys(occupancy).length) {
      return {
        occupancy,
        operatorName: journeyDetails.train.operator?.name,
      };
    }
    return notFoundResponse(404);
  }
}
