import { Controller, Get, Query, Route, Tags } from 'tsoa';
import { fasta, news, stationSearch } from 'business-hub';
import type { BusinessHubStation } from 'business-hub/types/StopPlaces';

@Route('/businessHub/experimental')
export class BussinessHubExperimentalController extends Controller {
  @Get('/station/{searchTerm}')
  @Tags('BusinessHub Experimental')
  station(searchTerm: string): Promise<BusinessHubStation[]> {
    return stationSearch(searchTerm);
  }

  @Get('/news')
  @Tags('BusinessHub Experimental')
  news(
    @Query() offset?: number,
    @Query() limit?: number,
    @Query() groupIds?: number[],
    @Query() published?: boolean,
    @Query() sectionIds?: string[],
  ) {
    return news({
      offset,
      limit,
      groupIds,
      published,
      sectionIds,
    });
  }

  @Get('/fasta/{stadaId}')
  @Tags('BusinessHub Experimental')
  fasta(stadaId: string) {
    return fasta(stadaId);
  }
}
