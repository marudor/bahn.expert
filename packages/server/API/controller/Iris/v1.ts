import { allStations, stationSearch } from 'server/iris/stationSearch';
import { Controller, Get, Query, Route, Tags } from 'tsoa';
import { getAbfahrten } from 'server/iris';
import { noncdRequest, openDataRequest } from 'server/iris/helper';
import wingInfo from 'server/iris/wings';
import type { AbfahrtenResult, WingDefinition } from 'types/iris';
import type { IrisStation } from 'types/station';

@Route('/iris/v1')
export class IrisController extends Controller {
  @Get('/wings/{rawId1}/{rawId2}')
  @Tags('IRIS V1')
  wings(rawId1: string, rawId2: string): Promise<WingDefinition> {
    return wingInfo(rawId1, rawId2);
  }

  @Get('/abfahrten/{evaId}')
  @Tags('IRIS V1')
  abfahrten(
    evaId: string,
    /**
     * in Minutes
     */
    @Query() lookahead?: number,
    /**
     * in Minutes
     */
    @Query() lookbehind?: number,
    @Query() type?: 'open' | 'default',
  ): Promise<AbfahrtenResult> {
    if (evaId.length < 6) {
      throw {
        status: 400,
        error: 'Please provide a evaID',
      };
    }

    return getAbfahrten(
      evaId,
      true,
      {
        lookahead,
        lookbehind,
      },
      type === 'open' ? openDataRequest : noncdRequest,
    );
  }

  @Get('/station/{searchTerm}')
  @Tags('IRIS V1')
  station(searchTerm: string): Promise<IrisStation[]> {
    return stationSearch(searchTerm);
  }

  @Get('/stations')
  @Tags('IRIS V1')
  stations(): Promise<IrisStation[]> {
    return allStations();
  }
}
