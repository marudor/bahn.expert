import { Context } from 'koa';
import { Controller, Get, Query, Request, Response, Route, Tags } from 'tsoa';
import { DetailBusinessHubStation } from 'types/BusinessHub/StopPlaces';
import { getStation } from 'server/Abfahrten/station';
import {
  IrisStationWithRelated,
  Station,
  StationSearchType,
} from 'types/station';
import { searchAll } from 'server/Search/searchAll';
import businessHubSearch, {
  canUseBusinessHub,
  stationDetails,
} from 'server/Search/BusinessHub';
import DS100 from 'server/Search/DS100';
import favendoSearch from 'server/Search/Favendo';
import stationSearch from 'server/Search';

export const validationOverwrite = [
  {
    url: '/station/v1/search/:searchTerm',
    type: 'get',
    middleware: (ctx: any, next: any) => {
      // @ts-ignore
      if (!StationSearchType[ctx.query.type]) {
        ctx.query.type = StationSearchType.default;
      }

      return next();
    },
  },
];

@Route('/station/v1')
export class StationController extends Controller {
  @Get('/search/{searchTerm}')
  @Tags('Station V1')
  async searchStation(
    @Request() ctx: Context,
    searchTerm: string,
    @Query() type?: StationSearchType,
    @Query() max?: number
  ): Promise<Station[]> {
    const result = await stationSearch(searchTerm, type, max);

    ctx.res.setHeader('searchType', type!);

    return result;
  }

  @Get('/geoSearch')
  @Tags('Station V1')
  geoSearch(
    @Query() lat: number,
    @Query() lng: number,
    @Query() searchText: string = ''
  ): Promise<Station[]> {
    return canUseBusinessHub
      ? businessHubSearch(searchText, undefined, {
          latitude: lat,
          longitude: lng,
        })
      : favendoSearch(searchText, {
          lat,
          lng,
        });
  }

  @Get('/iris/{evaId}')
  @Tags('Station V1')
  irisSearch(evaId: string): Promise<IrisStationWithRelated> {
    return getStation(evaId, 1);
  }

  @Get('/station/{evaId}')
  @Tags('Station V1')
  stationDetails(evaId: string): Promise<DetailBusinessHubStation> {
    return stationDetails(evaId);
  }

  @Get('/searchAll/{searchTerm}')
  @Tags('Station V1')
  searchAll(searchTerm: string) {
    return searchAll(searchTerm);
  }

  @Response(400, 'No station found')
  @Get('/ds100/{ds100}')
  @Tags('Station V1')
  async ds100(ds100: string): Promise<Station> {
    const station = await DS100(ds100);

    if (station) {
      return station;
    }

    throw {
      status: 404,
    };
  }
}
