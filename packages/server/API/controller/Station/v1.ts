import { byPosition, byRl100, stationDetails } from 'business-hub';
import { CacheDatabases, createNewCache } from 'server/cache';
import {
  Controller,
  Deprecated,
  Get,
  Query,
  Request,
  Response,
  Route,
  Tags,
} from 'tsoa';
import { getStation } from 'server/iris/station';
import { StationSearchType } from 'types/station';
import stationSearch from 'server/Search';
import type {
  CommonStationWithLocation,
  IrisStationWithRelated,
  Station,
} from 'types/station';
import type { Context, Next } from 'koa';
import type { DetailBusinessHubStation } from 'business-hub/types/StopPlaces';

const geoCache = createNewCache<string, CommonStationWithLocation[]>(
  3 * 24 * 60 * 60,
  CacheDatabases.RISGeo,
);

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
  @Deprecated()
  async searchStation(
    @Request() ctx: Context,
    searchTerm: string,
    @Query() type?: StationSearchType,
    @Query() max?: number,
  ): Promise<CommonStationWithLocation[]> {
    const result = await stationSearch(searchTerm, type, max);

    ctx.res.setHeader('searchType', type!);

    return result;
  }

  /**
   * @isInt radius
   */
  @Get('/geoSearch')
  @Tags('Station')
  @Deprecated()
  async geoSearch(
    @Query() lat: number,
    @Query() lng: number,
    /** meter */
    @Query() radius = 500,
  ): Promise<CommonStationWithLocation[]> {
    const cacheKey = `${lat}${lng}${radius}`;
    const cached = await geoCache.get(cacheKey);
    if (cached) return cached;
    const result = (await byPosition(lat, lng, radius)).map((s) => ({
      title: s.names.DE.nameLong,
      id: s.evaNumber,
      location: s.position,
    }));
    void geoCache.set(cacheKey, result);
    return result;
  }

  @Get('/iris/{evaId}')
  @Tags('Station')
  @Deprecated()
  irisSearch(evaId: string): Promise<IrisStationWithRelated> {
    return getStation(evaId, 1);
  }

  @Get('/station/{evaId}')
  @Tags('Station')
  @Deprecated()
  stationDetails(evaId: string): Promise<DetailBusinessHubStation> {
    return stationDetails(evaId);
  }

  @Response(400, 'No station found')
  @Get('/ds100/{ds100}')
  @Tags('Station')
  @Deprecated()
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
