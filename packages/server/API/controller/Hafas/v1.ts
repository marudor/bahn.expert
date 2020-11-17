import {
  Body,
  Controller,
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
  AllowedSotMode,
  ParsedSearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
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
import type { SingleRoute } from 'types/routing';

interface SearchOnTripBody {
  sotMode: AllowedSotMode;
  id: string;
}

@Route('/hafas/v1')
export class HafasController extends Controller {
  @Get('/journeyDetails')
  @Tags('HAFAS')
  journeyDetails(
    @Query() jid: string,
    @Request() ctx: Context,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyDetails> {
    return JourneyDetails(jid, profile, ctx.query.raw);
  }

  @Post('/searchOnTrip')
  @Tags('HAFAS')
  searchOnTrip(
    @Body() body: SearchOnTripBody,
    @Request() ctx: Context,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<SingleRoute> {
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

    return SearchOnTrip(req, profile, ctx.query.raw);
  }

  @Response(404, 'Train not found')
  @Get('/details/{trainName}')
  @Tags('HAFAS')
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
  ): Promise<ParsedSearchOnTripResponse> {
    const details = await Detail(trainName, stop, station, date, profile);

    if (!details) {
      throw {
        status: 404,
      };
    }

    return details;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Get('/auslastung/{start}/{destination}/{trainNumber}/{time}')
  @Tags('HAFAS')
  auslastung(
    start: string,
    destination: string,
    trainNumber: string,
    /**
     * Unix Time (ms)
     */
    time: number,
  ) {
    return Auslastung(start, destination, trainNumber, time);
  }

  @Get('/arrivalStationBoard')
  @Tags('HAFAS')
  arrivalStationBoard(
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
  ): Promise<ArrivalStationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        type: 'ARR',
      },
      profile,
      ctx.query.raw,
    );
  }

  @Get('/departureStationBoard')
  @Tags('HAFAS')
  departureStationBoard(
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
  ): Promise<DepartureStationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        direction,
        type: 'DEP',
      },
      profile,
      ctx.query.raw,
    );
  }

  @Post('/journeyMatch')
  @Tags('HAFAS')
  @OperationId('JourneyMatch')
  postJourneyMatch(
    @Request() ctx: Context,
    @Body() options: JourneyMatchOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyMatchResponse[]> {
    return JourneyMatch(options, profile, ctx.query.raw);
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
  journeyGeoPos(
    @Request() ctx: Context,
    @Body() body: JourneyGeoPosOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyGeoPosResponse> {
    return JourneyGeoPos(body, profile, ctx.query.raw);
  }

  @Get('/positionForTrain/{trainName}')
  @Tags('HAFAS')
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
