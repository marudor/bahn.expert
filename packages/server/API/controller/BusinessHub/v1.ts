import { Controller, Get, OperationId, Route, Tags } from 'tsoa';
import { fasta, stationOccupancy, stationQuays } from 'business-hub';
import type { FastaResponse } from 'business-hub/types/Fasta';
import type { OccupancyResponse } from 'business-hub/types/Occupancy';
import type { Quay } from 'business-hub/types/Quays';

@Route('/businessHub/v1')
export class BusinessHubV1Controller extends Controller {
  @Get('/stationOccupancy/{evaId}/{date}')
  @Tags('BusinessHub')
  @OperationId('Bahnhofs Auslastung')
  stationOccupancy(evaId: string, date: Date): Promise<OccupancyResponse> {
    return stationOccupancy(evaId, date);
  }

  @Get('/stationQuays/{evaId}')
  @Tags('BusinessHub')
  @OperationId('Gleise')
  quays(evaId: string): Promise<Quay[]> {
    return stationQuays(evaId);
  }

  @Get('/fasta/{stadaId}')
  @Tags('BusinessHub')
  @OperationId('Fahrstühle')
  fasta(stadaId: string): Promise<FastaResponse> {
    return fasta(stadaId);
  }
}
