import {
  Body,
  Controller,
  Get,
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
import type { Context } from 'koa';
import type {
  JourneyMatchOptions,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import type { ParsedJourneyDetails } from 'types/HAFAS/JourneyDetails';
import type { SingleRoute } from 'types/routing';

export interface SearchOnTripBody {
  sotMode: AllowedSotMode;
  id: string;
}

@Route('/hafas/v2')
export class HafasControllerV2 extends Controller {
  @Get('/journeyDetails')
  @Tags('HAFAS')
  @OperationId('JourneyDetails v2')
  async journeyDetails(
    @Query() jid: string,
    @Request() ctx: Context,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyDetails> {
    return JourneyDetails(jid, profile, ctx.query.raw);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Get('/auslastung/{start}/{destination}/{trainNumber}/{time}')
  @Tags('HAFAS')
  @OperationId('Auslastung v2')
  auslastung(
    start: string,
    destination: string,
    trainNumber: string,
    time: Date,
  ) {
    return Auslastung(start, destination, trainNumber, time);
  }

  @Get('/arrivalStationBoard')
  @Tags('HAFAS')
  @OperationId('Arrival Station Board v2')
  arrivalStationBoard(
    @Request() ctx: Context,
    /**
     * EvaId
     */
    @Query() station: string,
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
      ctx.query.raw,
    );
  }

  @Get('/departureStationBoard')
  @Tags('HAFAS')
  @OperationId('Departure Station Board v2')
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
      ctx.query.raw,
    );
  }

  @Post('/journeyMatch')
  @Tags('HAFAS')
  @OperationId('Journey Match v2')
  postJourneyMatch(
    @Request() ctx: Context,
    @Body() options: JourneyMatchOptions,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedJourneyMatchResponse[]> {
    return JourneyMatch(options, profile, ctx.query.raw);
  }

  @Response(404, 'Train not found')
  @Get('/details/{trainName}')
  @Tags('HAFAS')
  @OperationId('Details v2')
  async details(
    trainName: string,
    @Query() stop?: string,
    /**
     * EVA Id of a stop of your train
     */
    @Query() station?: string,
    @Query() date?: Date,
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

  @Post('/searchOnTrip')
  @Tags('HAFAS')
  @OperationId('Search on Trip v2')
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
}
