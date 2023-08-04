import { additionalJourneyInformation } from '@/server/journeys/additionalJourneyInformation';
import {
  Body,
  Controller,
  Get,
  OperationId,
  Post,
  Query,
  Request,
  Res,
  Route,
  Tags,
} from '@tsoa/runtime';
import { locMatch } from '@/server/HAFAS/LocMatch';
import { stopOccupancy } from '@/server/HAFAS/occupancy';
import { tripSearch } from '@/server/HAFAS/TripSearch/TripSearch';
import StationBoard from '@/server/HAFAS/StationBoard';
import StationBoardToTimetables from '@/server/HAFAS/StationBoard/StationBoardToTimetables';
import type { AbfahrtenResult } from '@/types/iris';
import type { AdditionalJourneyInformation } from '@/types/HAFAS/JourneyDetails';
import type {
  AllowedHafasProfile,
  HafasResponse,
  HafasStation,
} from '@/types/HAFAS';
import type {
  ArrivalStationBoardEntry,
  StationBoardEntry,
} from '@/types/stationBoard';
import type { Request as KRequest } from 'koa';
import type { LocMatchResponse } from '@/types/HAFAS/LocMatch';
import type { Route$Auslastung, RoutingResult } from '@/types/routing';
import type { StationBoardResponse } from '@/types/HAFAS/StationBoard';
import type { TripSearchOptionsV3 } from '@/types/HAFAS/TripSearch';
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
    return tripSearch(body, profile, Boolean(req.query.raw));
  }

  @Get('/additionalInformation/{trainName}/{journeyId}')
  @Tags('HAFAS')
  @OperationId('Additional Information')
  async additionalInformation(
    @Res() notFoundResponse: TsoaResponse<404, void>,
    trainName: string,
    /**
     * RIS JourneyId
     */
    journeyId: string,
    @Query() evaNumberAlongRoute?: string,
    @Query() initialDepartureDate?: Date,
  ): Promise<AdditionalJourneyInformation> {
    const additionalInformation = await additionalJourneyInformation(
      trainName,
      journeyId,
      evaNumberAlongRoute,
      initialDepartureDate,
    );

    return additionalInformation || notFoundResponse(404);
  }

  /**
   * Provides occupancy for specified stop based on DB Vertrieb HAFAS (DB Navigator).
   * Based on a rough estimate, handles first and second class.
   * @example start "Frankfurt (Main) Hbf"
   * @example destination "Basel SBB"
   * @example trainNumber "23"
   * @example plannedDepartureTime "2022-03-24T11:50:00.000Z"
   * @example evaStop "8000105"
   */
  @Get(
    '/occupancy/{start}/{destination}/{trainNumber}/{plannedDepartureTime}/{stopEva}',
  )
  @Tags('HAFAS')
  async occupancy(
    @Res() notFoundResponse: TsoaResponse<404, void>,
    /**
     * Name of the start stop
     */
    start: string,
    /**
     * Name of the destination stop
     */
    destination: string,
    /**
     * Planned Departure time of the stop you want the occpuancy for
     */
    plannedDepartureTime: Date,
    trainNumber: string,
    stopEva: string,
  ): Promise<Route$Auslastung> {
    const foundOccupancy = await stopOccupancy(
      start,
      destination,
      trainNumber,
      plannedDepartureTime,
      stopEva,
    );
    return foundOccupancy || notFoundResponse(404);
  }

  @Get('/departures/{evaNumber}')
  @Tags('HAFAS')
  async departures(
    evaNumber: string,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<StationBoardEntry[]> {
    const departures = await StationBoard(
      {
        type: 'DEP',
        station: evaNumber,
      },
      profile,
    );

    return departures;
  }

  @Get('/departures/{evaNumber}/raw')
  @Tags('HAFAS')
  async departuresRaw(
    evaNumber: string,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<HafasResponse<StationBoardResponse>> {
    const departures = await StationBoard(
      {
        type: 'DEP',
        station: evaNumber,
      },
      profile,
      true,
    );

    // @ts-expect-error works
    return departures;
  }

  @Get('/stopPlaceSearch/{query}')
  @Tags('HAFAS')
  async stopPlaceSearch(
    query: string,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<HafasStation[]> {
    const result = await locMatch(query, 'S', profile);

    return result;
  }

  @Get('/stopPlaceSearch/{query}/raw')
  @Tags('HAFAS')
  async stopPlaceSearchRaw(
    query: string,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<HafasResponse<LocMatchResponse>> {
    const result = await locMatch(query, 'S', profile, true);

    // @ts-expect-error works
    return result;
  }

  @Get('/irisCompatibleAbfahrten/{evaId}')
  @Tags('HAFAS')
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
        (map: Record<string, ArrivalStationBoardEntry>, arrival) => {
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
        .filter(Boolean)
        .slice(0, 75),
      wings: {},
      stopPlaces: [evaId],
    };
  }
}
