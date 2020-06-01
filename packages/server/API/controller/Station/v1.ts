import {
  geoSearch as BusinessHubGeoSearch,
  canUseBusinessHub,
  stationDetails,
} from 'business-hub';
import { Controller, Get, Query, Request, Response, Route, Tags } from 'tsoa';
import { getStation } from 'server/iris/station';
import {
  IrisStationWithRelated,
  Station,
  StationSearchType,
} from 'types/station';
import DS100 from 'server/Search/DS100';
import stationSearch from 'server/Search';
import type { Context } from 'koa';
import type { DetailBusinessHubStation } from 'business-hub/types/StopPlaces';

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
    // Meter
    @Query() radius?: number
  ): Promise<Station[]> {
    if (canUseBusinessHub) {
      return BusinessHubGeoSearch(
        {
          latitude: lat,
          longitude: lng,
        },
        radius
      );
    } else {
      throw new Error('geoSearch needs BusinessHub API Key');
    }
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
