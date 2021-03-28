import { Controller, Get, Query, Res, Response, Route, Tags } from 'tsoa';
import {
  geoSearchStopPlace,
  getIdentifiers,
  getStopPlaceByEva,
  searchStopPlace,
} from 'server/StopPlace/search';
import type { EvaNumber } from 'types/common';
import type { GroupedStopPlace, StopPlaceIdentifier } from 'types/stopPlace';
import type { TsoaResponse } from 'tsoa';

@Route('/stopPlace/v1')
export class StopPlaceController extends Controller {
  /**
   * @isInt max
   */
  @Get('/search/{searchTerm}')
  @Tags('StopPlace')
  stopPlaceSearch(
    searchTerm: string,
    @Query() max?: number,
    /** Only returns stopPlaces iris-tts can handle (/abfahrten) */
    @Query() filterForIris = false,
  ): Promise<GroupedStopPlace[]> {
    return searchStopPlace(searchTerm, max, filterForIris);
  }

  /**
   * @isInt lat
   * @isInt lng
   * @isInt radius
   */
  @Get('/geoSearch')
  @Tags('StopPlace')
  stopPlaceGeoSearch(
    @Query() lat: number,
    @Query() lng: number,
    /** meter */
    @Query() radius = 500,
    /** Only returns stopPlaces iris-tts can handle (/abfahrten) */
    @Query() filterForIris = false,
    @Query() max?: number,
  ): Promise<GroupedStopPlace[]> {
    return geoSearchStopPlace(lat, lng, radius, max, filterForIris);
  }

  @Response(404)
  @Get('/{evaNumber}')
  @Tags('StopPlace')
  async stopPlaceByEva(
    evaNumber: EvaNumber,
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<GroupedStopPlace> {
    const stopPlace = await getStopPlaceByEva(evaNumber);
    if (!stopPlace) {
      return notFoundResponse(404);
    }
    return stopPlace;
  }

  @Response(404)
  @Get('/{evaNumber}/identifier')
  @Tags('StopPlace')
  async stopPlaceIdentifier(
    evaNumber: EvaNumber,
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<StopPlaceIdentifier> {
    const identifiers = await getIdentifiers(evaNumber);
    if (!identifiers) {
      return notFoundResponse(404);
    }
    return identifiers;
  }
}
