import {
  Body,
  Controller,
  Deprecated,
  Get,
  OperationId,
  Post,
  Query,
  Request,
  Res,
  Response,
  Route,
  Tags,
} from '@tsoa/runtime';
import Auslastung from 'server/HAFAS/Auslastung';
import Detail from 'server/HAFAS/Detail';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import JourneyMatch from 'server/HAFAS/JourneyMatch';
import SearchOnTrip from 'server/HAFAS/SearchOnTrip';
import StationBoard from 'server/HAFAS/StationBoard';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  AllowedSotMode,
  ParsedSearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import type {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from 'types/stationBoard';
import type { EvaNumber } from 'types/common';
import type {
  JourneyMatchOptions,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import type { Request as KRequest } from 'koa';
import type { ParsedJourneyDetails } from 'types/HAFAS/JourneyDetails';
import type { Route$Auslastung, SingleRoute } from 'types/routing';
import type { TsoaResponse } from '@tsoa/runtime';

export interface SearchOnTripBody {
  sotMode: AllowedSotMode;
  id: string;
}

@Route('/hafas/v2')
export class HafasControllerV2 extends Controller {
  /**
   * provides Details for a specific Journey [Fahrt]
   */
  @Get('/journeyDetails')
  @Tags('HAFAS')
  @OperationId('JourneyDetails v2')
  async journeyDetails(
    @Query() jid: string,
    @Request() req: KRequest,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyDetails> {
    // @ts-expect-error untyped
    return JourneyDetails(jid, profile, req.query.raw);
  }

  /**
   * Provides Auslstaung based on DB Vertrieb HAFAS (DB Navigator).
   * Based on a rough estimate, handles first and second class.
   * @example start "Frankfurt (Main) Hbf"
   * @example destination "Basel SBB"
   * @example trainNumber "23"
   * @example plannedDepartureTime "2022-03-24T11:50:00.000Z"
   */
  @Get('/auslastung/{start}/{destination}/{trainNumber}/{plannedDepartureTime}')
  @Tags('HAFAS')
  @OperationId('Auslastung v2')
  auslastung(
    /**
     * Name of the start stop
     */
    start: string,
    /**
     * Name of the destination stop
     */
    destination: string,
    /**
     *
     */
    trainNumber: string,
    /**
     * Planned Departure time of the stop you want the occpuancy for
     */
    plannedDepartureTime: Date,
  ): Promise<Route$Auslastung> {
    // @ts-expect-error TODO: use @res with 404
    return Auslastung(start, destination, trainNumber, plannedDepartureTime);
  }

  /**
   * Used to get all arrivals at a specific stopPlace
   */
  @Get('/arrivalStationBoard')
  @Tags('HAFAS')
  @OperationId('Arrival Station Board v2')
  arrivalStationBoard(
    @Request() req: KRequest,
    @Query() station: EvaNumber,
    @Query() date?: Date,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ArrivalStationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        type: 'ARR',
      },
      profile,
      // @ts-expect-error untyped
      req.query.raw as boolean,
    );
  }

  /**
   * Used to get all departures at a specific stopPlace.
   * Optionally filterable to get only Journeys that travel via a specific stopPlace
   */
  @Get('/departureStationBoard')
  @Tags('HAFAS')
  @OperationId('Departure Station Board v2')
  departureStationBoard(
    @Request() req: KRequest,
    @Query() station: EvaNumber,
    @Query() direction?: EvaNumber,
    @Query() date?: Date,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<DepartureStationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        direction,
        type: 'DEP',
      },
      profile,
      // @ts-expect-error untyped
      req.query.raw as boolean,
    );
  }

  /**
   *
   * Used to find a specific journey based on name, date and HAFAS filter.
   */
  @Post('/journeyMatch')
  @Tags('HAFAS')
  @OperationId('Journey Match v2')
  postJourneyMatch(
    @Request() req: KRequest,
    @Body() options: JourneyMatchOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyMatchResponse[]> {
    // @ts-expect-error untyped
    return JourneyMatch(options, profile, req.query.raw);
  }

  /**
   * This combines several HAFAS endpoint as well as IRIS data to get the best possible information for a specific journey.
   * @example trainName "ICE 23"
   */
  @Response(404, 'Train not found')
  @Get('/details/{trainName}')
  @Tags('HAFAS')
  @OperationId('Details v2')
  async details(
    @Res() notFoundResponse: TsoaResponse<404, void>,
    trainName: string,
    @Deprecated() @Query() stop?: string,
    /**
     * EvaNumber of a stop of your train, might not work for profiles other than DB
     */
    @Query() station?: EvaNumber,
    /**
     * This is the initialDepartureDate of your desired journey
     */
    @Query() date?: Date,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedSearchOnTripResponse> {
    const details = await Detail(trainName, stop, station, date, profile);

    if (!details) {
      return notFoundResponse(404);
    }
    return details;
  }

  /**
   * Advanced HAFAS Method, not used by marudor.de and therefore quite undocumented
   */
  @Post('/searchOnTrip')
  @Tags('HAFAS')
  @OperationId('Search on Trip v2')
  searchOnTrip(
    @Body() body: SearchOnTripBody,
    @Request() req: KRequest,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<SingleRoute> {
    const { sotMode, id } = body;

    const hafasRequest =
      sotMode === 'RC'
        ? {
            sotMode,
            ctxRecon: id,
          }
        : {
            sotMode,
            jid: id,
          };

    // @ts-expect-error untyped
    return SearchOnTrip(hafasRequest, profile, req.query.raw);
  }
}
