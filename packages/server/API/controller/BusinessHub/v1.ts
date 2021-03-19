import { Controller, Deprecated, Get, OperationId, Route, Tags } from 'tsoa';
import { platforms, stationOccupancy, stationQuays } from 'business-hub';
import type { OccupancyResponse } from 'business-hub/types/Occupancy';
import type { Platform } from 'business-hub/types/RisStations';
import type { Quay } from 'business-hub/types/Quays';

@Route('/businessHub/v1')
export class BusinessHubV1Controller extends Controller {
  @Get('/stationOccupancy/{evaId}/{date}')
  @Tags('BusinessHub')
  @OperationId('Bahnhofs Auslastung')
  stationOccupancy(evaId: string, date: Date): Promise<OccupancyResponse> {
    return stationOccupancy(evaId, date);
  }

  @Get('/stationQuays/{evaNumber}')
  @Tags('BusinessHub')
  @OperationId('Gleise')
  @Deprecated()
  quays(evaNumber: string): Promise<Quay[]> {
    return stationQuays(evaNumber);
  }

  @Get('/platforms/{evaNumber}')
  @Tags('BusinessHub')
  @OperationId('Gleise')
  platforms(evaNumber: string): Promise<Platform[]> {
    return platforms(evaNumber);
  }
}
