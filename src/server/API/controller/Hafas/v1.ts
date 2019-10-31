import { AllowedHafasProfile, HafasStation } from 'types/HAFAS';
import {
  AllowedSotMode,
  ParsedSearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import {
  Body,
  Controller,
  Get,
  Hidden,
  Post,
  Query,
  Response,
  Route,
  Tags,
} from 'tsoa';
import { ParsedJourneyDetails } from 'types/HAFAS/JourneyDetails';
import { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import { Route$Auslastung, RoutingResult } from 'types/routing';
import { Station } from 'types/station';
import { StationBoardEntry } from 'types/stationBoard';
import { TrainSearchResult } from 'types/HAFAS/Details';
import { TripSearchOptions, TripSearchRequest } from 'types/HAFAS/TripSearch';
import AuslastungHafas from 'server/Auslastung/Hafas';
import Detail from 'server/HAFAS/Detail';
import JourneyDetails from 'server/HAFAS/JourneyDetails';
import JourneyMatch from 'server/HAFAS/JourneyMatch';
import LocGeoPos from 'server/HAFAS/LocGeoPos';
import LocMatch from 'server/HAFAS/LocMatch';
import makeRequest from 'server/HAFAS/Request';
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
  @Post('/journeyDetails')
  @Tags('HAFAS V1')
  journeyDetails(
    @Body() jid: string,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedJourneyDetails> {
    return JourneyDetails(jid, profile);
  }

  @Post('/searchOnTrip')
  @Tags('HAFAS V1')
  searchOnTrip(
    @Body() body: SearchOnTripBody,
    @Query() profile?: AllowedHafasProfile
  ) {
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

    return SearchOnTrip(req, profile);
  }

  @Response(404, 'Train not found')
  @Get('/details/{trainName}/{date}')
  @Tags('HAFAS V1')
  async details(
    trainName: string,
    date?: number,
    @Query() stop?: string,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedSearchOnTripResponse> {
    const details = await Detail(trainName, stop, date, profile);

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
    time: number
  ): Promise<Route$Auslastung> {
    return AuslastungHafas(start, destination, trainNumber, time);
  }

  @Get('/arrivalStationBoard')
  @Tags('HAFAS V1')
  arrivalStationBoard(
    @Query() date: number,
    @Query() station: string,
    @Query() profile?: AllowedHafasProfile
  ): Promise<StationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        type: 'ARR',
      },
      profile
    );
  }

  @Get('/departureStationBoard')
  @Tags('HAFAS V1')
  departureStationBoard(
    @Query() date: number,
    @Query() station: string,
    @Query() direction?: string,
    @Query() profile?: AllowedHafasProfile
  ): Promise<StationBoardEntry[]> {
    return StationBoard(
      {
        station,
        date,
        direction,
        type: 'DEP',
      },
      profile
    );
  }

  @Response(404, 'Train not found')
  @Get('/trainSearch/{trainName}/{date}')
  @Tags('HAFAS V1')
  async trainSearch(
    trainName: string,
    date?: number,
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

  @Get('/journeyMatch/{trainName}/{date}')
  @Tags('HAFAS V1')
  journeyMatch(
    trainName: string,
    date?: number,
    @Query() profile?: AllowedHafasProfile
  ): Promise<ParsedJourneyMatchResponse[]> {
    return JourneyMatch(trainName, date, profile);
  }

  @Get('/geoStation')
  @Tags('HAFAS V1')
  geoStation(
    @Query() lat: number,
    @Query() lng: number,
    @Query() maxDist: number = 1000,
    @Query() profile?: AllowedHafasProfile
  ): Promise<HafasStation[]> {
    return LocGeoPos(lng * 1000000, lat * 1000000, maxDist, profile);
  }

  @Get('/station/{searchTerm}')
  @Tags('HAFAS V1')
  station(
    searchTerm: string,
    @Query() profile?: AllowedHafasProfile
  ): Promise<Station[]> {
    return LocMatch(searchTerm, undefined, profile);
  }

  @Post('/route')
  @Tags('HAFAS V1')
  route(
    @Body() body: TripSearchOptions,
    @Query() profile?: AllowedHafasProfile
  ): Promise<RoutingResult> {
    return TripSearch(body, profile);
  }

  @Hidden()
  @Post('/rawHafas')
  rawHafas(
    @Body() body: TripSearchRequest,
    @Query() profile?: AllowedHafasProfile
  ) {
    return makeRequest(body, undefined, profile);
  }
}
