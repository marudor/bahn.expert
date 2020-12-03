import {
  Body,
  Controller,
  Deprecated,
  Get,
  Hidden,
  OperationId,
  Post,
  Query,
  Request,
  Response,
  Route,
  Tags,
} from 'tsoa';
import { convertDateToEpoch } from 'server/API/controller/Hafas/convertDateToEpoch';
import Auslastung from 'server/HAFAS/Auslastung';
import Detail from 'server/HAFAS/Detail';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import JourneyGeoPos from 'server/HAFAS/JourneyGeoPos';
import JourneyMatch, { enrichedJourneyMatch } from 'server/HAFAS/JourneyMatch';
import LocGeoPos from 'server/HAFAS/LocGeoPos';
import LocMatch from 'server/HAFAS/LocMatch';
import makeRequest from 'server/HAFAS/Request';
import PositionForTrain from 'server/HAFAS/PositionForTrain';
import SearchOnTrip from 'server/HAFAS/SearchOnTrip';
import StationBoard from 'server/HAFAS/StationBoard';
import type { AllowedHafasProfile, HafasStation } from 'types/HAFAS';
import type {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from 'types/stationBoard';
import type { Context } from 'koa';
import type {
  JourneyGeoPosOptions,
  ParsedJourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';
import type {
  JourneyMatchOptions,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import type { ParsedJourneyDetails } from 'types/HAFAS/JourneyDetails';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import type { SearchOnTripBody } from 'server/API/controller/Hafas/v2';
import type { SingleRoute } from 'types/routing';

@Route('/hafas/v1')
export class HafasController extends Controller {
  @Get('/journeyDetails')
  @Tags('HAFAS')
  @Deprecated()
  @OperationId('JourneyDetails v1')
  async journeyDetailsv1(
    @Query() jid: string,
    @Request() ctx: Context,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyDetails<number>> {
    const v2Details = await JourneyDetails(jid, profile, ctx.query.raw);
    convertDateToEpoch(v2Details);
    // @ts-expect-error we just converted!
    return v2Details;
  }

  @Post('/searchOnTrip')
  @Tags('HAFAS')
  @Deprecated()
  @OperationId('Search on Trip v1')
  async searchOnTrip(
    @Body() body: SearchOnTripBody,
    @Request() ctx: Context,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<SingleRoute<number>> {
    const { sotMode, id } = body;
    let req;

    if (sotMode === 'RC') {
      req = {
        sotMode,
        ctxRecon: id,
      };
    } else {
      req = {
        sotMode,
        jid: id,
      };
    }

    const result = await SearchOnTrip(req, profile, ctx.query.raw);
    convertDateToEpoch(result);
    // @ts-expect-error we just converted!
    return result;
  }

  @Response(404, 'Train not found')
  @Get('/details/{trainName}')
  @Tags('HAFAS')
  @Deprecated()
  @OperationId('Details v1')
  async details(
    trainName: string,
    /**
     * Unix Time (ms)
     */
    @Query() stop?: string,
    /**
     * EVA Id of a stop of your train
     */
    @Query() station?: string,
    /**
     * Initial Departure Date (Unix Timestap)
     */
    @Query() date?: number,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedSearchOnTripResponse<number>> {
    const details = await Detail(
      trainName,
      stop,
      station,
      date ? new Date(date) : undefined,
      profile,
    );

    if (!details) {
      throw {
        status: 404,
      };
    }
    convertDateToEpoch(details);
    // @ts-expect-error we just converted
    return details as ParsedSearchOnTripResponse<number>;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Get('/auslastung/{start}/{destination}/{trainNumber}/{time}')
  @Tags('HAFAS')
  @Deprecated()
  @OperationId('Auslastung v1')
  auslastung(
    start: string,
    destination: string,
    trainNumber: string,
    /**
     * Unix Time (ms)
     */
    time: number,
  ) {
    return Auslastung(start, destination, trainNumber, new Date(time));
  }

  @Get('/arrivalStationBoard')
  @Tags('HAFAS')
  @Deprecated()
  @OperationId('Arrival Station Board v1')
  async arrivalStationBoard(
    @Request() ctx: Context,
    /**
     * EvaId
     */
    @Query() station: string,
    /**
     * Unix Time (ms)
     */
    @Query() date?: number,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ArrivalStationBoardEntry<number>[]> {
    const board = await StationBoard(
      {
        station,
        date: date ? new Date(date) : undefined,
        type: 'ARR',
      },
      profile,
      ctx.query.raw,
    );
    convertDateToEpoch(board);
    // @ts-expect-error just converted
    return board;
  }

  @Get('/departureStationBoard')
  @Tags('HAFAS')
  @Deprecated()
  @OperationId('Departure Station Board v1')
  async departureStationBoard(
    @Request() ctx: Context,
    /**
     * EvaId
     */
    @Query() station: string,
    /**
     * EvaId
     */
    @Query() direction?: string,
    /**
     * Unix Time (ms)
     */
    @Query() date?: number,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<DepartureStationBoardEntry<number>[]> {
    const board = await StationBoard(
      {
        station,
        date: date ? new Date(date) : undefined,
        direction,
        type: 'DEP',
      },
      profile,
      ctx.query.raw,
    );
    convertDateToEpoch(board);
    // @ts-expect-error just converted
    return board;
  }

  @Post('/journeyMatch')
  @Tags('HAFAS')
  @OperationId('Journey Match v1')
  @Deprecated()
  async postJourneyMatch(
    @Request() ctx: Context,
    @Body() options: JourneyMatchOptions<number>,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyMatchResponse<number>[]> {
    const match = await JourneyMatch(
      {
        ...options,
        initialDepartureDate: options.initialDepartureDate
          ? new Date(options.initialDepartureDate)
          : undefined,
      },
      profile,
      ctx.query.raw,
    );
    convertDateToEpoch(match);
    // @ts-expect-error just converted
    return match;
  }

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
