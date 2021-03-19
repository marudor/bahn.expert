import { byPosition, byRl100, stationDetails } from 'business-hub';
import { Controller, Get, Query, Request, Response, Route, Tags } from 'tsoa';
import { getStation } from 'server/iris/station';
import { StationSearchType } from 'types/station';
import stationSearch from 'server/Search';
import type {
  CommonStation,
  IrisStationWithRelated,
  Station,
} from 'types/station';
import type { Context, Next } from 'koa';
import type { DetailBusinessHubStation } from 'business-hub/types/StopPlaces';

export const validationOverwrite = [
  {
    url: '/api/station/v1/search/:searchTerm',
    type: 'get',
    middleware: (ctx: Context, next: Next): Promise<any> => {
      // @ts-expect-error enum works
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
  @Tags('Station')
  async searchStation(
    @Request() ctx: Context,
    searchTerm: string,
    @Query() type?: StationSearchType,
    @Query() max?: number,
  ): Promise<Station[]> {
    const result = await stationSearch(searchTerm, type, max);

    ctx.res.setHeader('searchType', type!);

    return result;
  }

  @Get('/geoSearch')
  @Tags('Station')
  geoSearch(
    @Query() lat: number,
    @Query() lng: number,
    // Meter
    @Query() radius?: number,
  ): Promise<CommonStation[]> {
    return byPosition(lat, lng, radius || 500).then((list) =>
      list.map((s) => ({
        title: s.names.DE.nameLong,
        id: s.evaNumber,
      })),
    );
  }

  @Get('/iris/{evaId}')
  @Tags('Station')
  irisSearch(evaId: string): Promise<IrisStationWithRelated> {
    return getStation(evaId, 1);
  }

  @Get('/station/{evaId}')
  @Tags('Station')
  stationDetails(evaId: string): Promise<DetailBusinessHubStation> {
    return stationDetails(evaId);
  }

  @Response(400, 'No station found')
  @Get('/ds100/{ds100}')
  @Tags('Station')
  async ds100(ds100: string): Promise<Station> {
    const station = await byRl100(ds100);

    if (station) {
      return {
        title: station.names.DE.nameLong,
        id: station.evaNumber,
        DS100: ds100,
      };
    }

    throw {
      status: 404,
    };
  }
}
