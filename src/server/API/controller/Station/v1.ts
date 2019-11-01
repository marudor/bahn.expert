import { Controller, Get, Query, Route, Tags } from 'tsoa';
import { getStation } from 'server/Abfahrten/station';
import {
  IrisStationWithRelated,
  Station,
  StationSearchType,
} from 'types/station';
import favendoSearch from 'server/Search/Favendo';
import stationSearch from 'server/Search';

export const validationOverwrite = [
  {
    url: '/station/v1/search/:searchTerm',
    type: 'get',
    middleware: (ctx: any, next: any) => {
      // @ts-ignore
      if (!StationSearchType[ctx.query.type]) {
        ctx.query.type = StationSearchType.Default;
      }

      return next();
    },
  },
];

@Route('/station/v1')
export class StationController extends Controller {
  @Get('/search/{searchTerm}')
  @Tags('Station V1')
  searchStation(
    searchTerm: string,
    @Query() type?: StationSearchType,
    @Query() max?: number
  ): Promise<Station[]> {
    return stationSearch(searchTerm, type, max);
  }

  @Get('/geoSearch')
  @Tags('Station V1')
  geoSearch(@Query() lat: number, @Query() lng: number): Promise<Station[]> {
    return favendoSearch('', {
      lat,
      lng,
    });
  }

  @Get('/iris/{evaId}')
  @Tags('Station V1')
  irisSearch(evaId: string): Promise<IrisStationWithRelated> {
    return getStation(evaId, 1);
  }
}
