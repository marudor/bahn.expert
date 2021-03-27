import { Controller, Get, Query, Route, Tags } from 'tsoa';
import {
  geoSearchStopPlace,
  getIdentifiers,
  searchStopPlace,
} from 'server/StopPlace/search';
import type {
  GroupedStopPlace,
  StopPlaceIdentifier,
} from 'server/StopPlace/search';

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
    @Query() filterForIris = false,
  ): Promise<GroupedStopPlace[]> {
    return geoSearchStopPlace(lat, lng, radius, filterForIris);
  }

  @Get('/{evaNumber}/identifier')
  @Tags('StopPlace')
  async stopPlaceIdentifier(evaNumber: string): Promise<StopPlaceIdentifier> {
    return (await getIdentifiers(evaNumber)) || {};
  }
}
