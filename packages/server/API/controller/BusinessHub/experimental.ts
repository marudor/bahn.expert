import { Controller, Get, Hidden, OperationId, Route, Tags } from 'tsoa';
import { fasta, stationQuays, stationSearch } from 'business-hub';
import type { BusinessHubStation } from 'business-hub/types/StopPlaces';
import type { FastaResponse } from 'business-hub/types/Fasta';
import type { Quay } from 'business-hub/types/Quays';

@Route('/businessHub/experimental')
export class BussinessHubExperimentalController extends Controller {
  @Get('/station/{searchTerm}')
  @Hidden()
  @Tags('BusinessHub experimental')
  @OperationId('BusinessHub Station')
  station(searchTerm: string): Promise<BusinessHubStation[]> {
    return stationSearch(searchTerm);
  }

  @Get('/fasta/{stadaId}')
  @Tags('BusinessHub experimental')
  @OperationId('Fahrstühle')
  fasta(stadaId: string): Promise<FastaResponse> {
    return fasta(stadaId);
  }

  @Get('/stationQuays/{evaId}')
  @Tags('BusinessHub experimental')
  @OperationId('Gleise')
  quays(evaId: string): Promise<Quay[]> {
    return stationQuays(evaId);
  }
}
