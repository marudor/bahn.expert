import { Controller, Get, OperationId, Route, Tags } from 'tsoa';
import { platforms, stationOccupancy } from 'business-hub';
import type { EvaNumber } from 'types/common';
import type { OccupancyResponse } from 'business-hub/types/Occupancy';
import type { Platform } from 'business-hub/types/RisStations';

@Route('/businessHub/v1')
export class BusinessHubV1Controller extends Controller {
  @Get('/stationOccupancy/{evaNumber}/{date}')
  @Tags('BusinessHub')
  @OperationId('Bahnhofs Auslastung')
  stationOccupancy(
    evaNumber: EvaNumber,
    date: Date,
  ): Promise<OccupancyResponse> {
    return stationOccupancy(evaNumber, date);
  }

  @Get('/platforms/{evaNumber}')
  @Tags('BusinessHub')
  @OperationId('Gleise')
  platforms(evaNumber: EvaNumber): Promise<Platform[]> {
    return platforms(evaNumber);
  }
}
