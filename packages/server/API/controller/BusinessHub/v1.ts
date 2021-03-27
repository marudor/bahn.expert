import { Controller, Get, OperationId, Route, Tags } from 'tsoa';
import { platforms, stationOccupancy } from 'business-hub';
import type { OccupancyResponse } from 'business-hub/types/Occupancy';
import type { Platform } from 'business-hub/types/RisStations';

@Route('/businessHub/v1')
export class BusinessHubV1Controller extends Controller {
  @Get('/stationOccupancy/{evaId}/{date}')
  @Tags('BusinessHub')
  @OperationId('Bahnhofs Auslastung')
  stationOccupancy(evaId: string, date: Date): Promise<OccupancyResponse> {
    return stationOccupancy(evaId, date);
  }

  @Get('/platforms/{evaNumber}')
  @Tags('BusinessHub')
  @OperationId('Gleise')
  platforms(evaNumber: string): Promise<Platform[]> {
    return platforms(evaNumber);
  }
}
