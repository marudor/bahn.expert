import { Controller, Get, OperationId, Route, Tags } from 'tsoa';
import { stationOccupancy } from 'business-hub';
import type { OccupancyResponse } from 'business-hub/types/Occupancy';

@Route('/businessHub/v1')
export class BusinessHubV1Controller extends Controller {
  @Get('/stationOccupancy/{evaId}/{date}')
  @Tags('BusinessHub')
  @OperationId('Bahnhofs Auslastung v1')
  stationOccupancy(evaId: string, date: Date): Promise<OccupancyResponse> {
    return stationOccupancy(evaId, date);
  }
}
