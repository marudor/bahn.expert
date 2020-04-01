import { AllowedHafasProfile, HafasStation } from 'types/HAFAS';
import {
  AllowedSotMode,
  ParsedSearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from 'types/stationBoard';
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
import { Context } from 'koa';
import {
  JourneyGeoPosOptions,
  ParsedJourneyGeoPosResponse,
} from 'types/HAFAS/JourneyGeoPos';
import {
  JourneyMatchOptions,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import { ParsedJourneyDetails } from 'types/HAFAS/JourneyDetails';
import { Route$Auslastung, RoutingResult, SingleRoute } from 'types/routing';
import { TrainSearchResult } from 'types/HAFAS/Details';
import { TripSearchOptions } from 'types/HAFAS/TripSearch';
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
import TrainSearch from 'server/HAFAS/TrainSearch';
import TripSearch from 'server/HAFAS/TripSearch';

interface SearchOnTripBody {
  sotMode: AllowedSotMode;
  id: string;
}

@Route('/hafas/v1')
export class HafasController extends Controller {
  @Get('/journeyDetails')
  @Tags('HAFAS V1')
  journeyDetails(
    @Query() jid: string,
    @Request() ctx: Context,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedJourneyDetails> {
    return JourneyDetails(jid, profile, ctx.query.raw);
  }

  @Post('/searchOnTrip')
  @Tags('HAFAS V1')
  searchOnTrip(
    @Body() body: SearchOnTripBody,
    @Request() ctx: Context,
    @Query() profile?: AllowedHafasProfile
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
  @Tags('HAFAS V1')
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
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedSearchOnTripResponse> {
    const details = await Detail(trainName, stop, station, date, profile);

    if (!details) {
      throw {
        status: 404,
      };
    }

    return details;
  }

  @Get('/auslastung/{start}/{destination}/{trainNumber}/{time}')
  @Tags('HAFAS V1')
  auslastung(
    start: string,
    destination: string,
    trainNumber: string,
    /**
     * Unix Time (ms)
     */
    time: number
  ): Promise<Route$Auslastung> {
    return Auslastung(start, destination, trainNumber, time);
  }

  @Get('/arrivalStationBoard')
  @Tags('HAFAS V1')
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
    @Query() profile?: AllowedHafasProfile
  ): Promise<ArrivalStationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        type: 'ARR',
      },
      profile,
      ctx.query.raw
    );
  }

  @Get('/departureStationBoard')
  @Tags('HAFAS V1')
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
    @Query() profile?: AllowedHafasProfile
  ): Promise<DepartureStationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        direction,
        type: 'DEP',
      },
      profile,
      ctx.query.raw
    );
  }

  @Response(404, 'Train not found')
  @Get('/trainSearch/{trainName}')
  @Tags('HAFAS V1')
  async trainSearch(
    trainName: string,
    /**
     * Unix Time (ms)
     */
    @Query() date?: number,
    @Query() profile?: AllowedHafasProfile
  ): Promise<TrainSearchResult> {
    const foundTrain = await TrainSearch(trainName, date, profile);

    if (!foundTrain) {
      throw {
        status: 404,
      };
    }

    return foundTrain;
  }

  @Get('/journeyMatch/{trainName}')
  @Deprecated()
  @Tags('HAFAS V1')
  journeyMatch(
    @Request() ctx: Context,
    trainName: string,
    /**
     * Unix Time (ms)
     */
    @Query() date?: number,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedJourneyMatchResponse[]> {
    return JourneyMatch(
      {
        trainName,
        initialDepartureDate: date,
      },
      profile,
      ctx.query.raw
    );
  }

  @Post('/journeyMatch')
  @Tags('HAFAS V1')
  @OperationId('JourneyMatch')
  postJourneyMatch(
    @Request() ctx: Context,
    @Body() options: JourneyMatchOptions,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedJourneyMatchResponse[]> {
    return JourneyMatch(options, profile, ctx.query.raw);
  }

  @Post('/enrichedJourneyMatch')
  @Hidden()
  enrichedJourneyMatch(
    @Body() options: JourneyMatchOptions,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedJourneyMatchResponse[]> {
    return enrichedJourneyMatch(options, profile);
  }

  @Get('/geoStation')
  @Tags('HAFAS V1')
  geoStation(
    @Request() ctx: Context,
    @Query() lat: number,
    @Query() lng: number,
    @Query() maxDist: number = 1000,
    @Query() profile?: AllowedHafasProfile
  ): Promise<HafasStation[]> {
    return LocGeoPos(
      lng * 1000000,
      lat * 1000000,
      maxDist,
      profile,
      ctx.query.raw
    );
  }

  @Get('/station/{searchTerm}')
  @Tags('HAFAS V1')
  station(
    @Request() ctx: Context,
    searchTerm: string,
    @Query() profile?: AllowedHafasProfile
  ): Promise<HafasStation[]> {
    return LocMatch(searchTerm, undefined, profile, ctx.query.raw);
  }

  @Post('/tripSearch')
  @Tags('HAFAS V1')
  tripSearch(
    @Request() ctx: Context,
    @Body() body: TripSearchOptions,
    @Query() profile?: AllowedHafasProfile
  ): Promise<RoutingResult> {
    return TripSearch(body, profile, ctx.query.raw);
  }

  @Deprecated()
  @Post('/route')
  @Tags('HAFAS V1')
  route(
    @Request() ctx: Context,
    @Body() body: TripSearchOptions,
    @Query() profile?: AllowedHafasProfile
  ): Promise<RoutingResult> {
    return TripSearch(body, profile, ctx.query.raw);
  }

  @Post('/journeyGeoPos')
  @Tags('HAFAS V1')
  journeyGeoPos(
    @Request() ctx: Context,
    @Body() body: JourneyGeoPosOptions,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedJourneyGeoPosResponse> {
    return JourneyGeoPos(body, profile, ctx.query.raw);
  }

  @Get('/positionForTrain/{trainName}')
  @Tags('HAFAS V1')
  async positionForTrain(
    trainName: string,
    @Query() profile?: AllowedHafasProfile
  ) {
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
  rawHafas(@Body() body: any, @Query() profile?: AllowedHafasProfile) {
    return makeRequest(body, undefined, profile);
  }
}
