import { Controller, Get, Query, Route, Tags } from 'tsoa';
import {
  fasta,
  news,
  stationOccupancy,
  stationQuays,
  stationSearch,
} from 'business-hub';
import type { BusinessHubStation } from 'business-hub/types/StopPlaces';
import type { FastaResponse } from 'business-hub/types/Fasta';
import type { NewsResponse } from 'business-hub/types/News';
import type { OccupancyResponse } from 'business-hub/types/Occupancy';
import type { Quay } from 'business-hub/types/Quays';

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
  ): Promise<NewsResponse> {
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
  fasta(stadaId: string): Promise<FastaResponse> {
    return fasta(stadaId);
  }

  @Get('/stationQuays/{evaId}')
  @Tags('BusinessHub Experimental')
  quays(evaId: string): Promise<Quay[]> {
    return stationQuays(evaId);
  }

  @Get('/stationOccupancy/{evaId}/{date}')
  @Tags('BusinessHub Experimental')
  stationOccupancy(
    evaId: string,
    /**
     * Unix Time (ms)
     */
    date: number,
  ): Promise<OccupancyResponse> {
    return stationOccupancy(evaId, date);
  }
}
