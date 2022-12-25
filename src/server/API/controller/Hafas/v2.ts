import {
  Controller,
  Deprecated,
  Get,
  OperationId,
  Query,
  Res,
  Response,
  Route,
  Tags,
} from '@tsoa/runtime';
import Detail from 'server/HAFAS/Detail';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type {
  AllowedSotMode,
  ParsedSearchOnTripResponse,
} from 'types/HAFAS/SearchOnTrip';
import type { EvaNumber } from 'types/common';
import type { TsoaResponse } from '@tsoa/runtime';

export interface SearchOnTripBody {
  sotMode: AllowedSotMode;
  id: string;
}

@Route('/hafas/v2')
export class HafasControllerV2 extends Controller {
  /**
   * This combines several HAFAS endpoint as well as IRIS data to get the best possible information for a specific journey.
   * @deprecated There is no replacement
   * @example trainName "ICE 23"
   */
  @Deprecated()
  @Response(404, 'Train not found')
  @Get('/details/{trainName}')
  @Tags('HAFAS')
  @OperationId('Details v2')
  async details(
    @Res() notFoundResponse: TsoaResponse<404, void>,
    trainName: string,
    @Deprecated() @Query() stop?: string,
    /**
     * EvaNumber of a stop of your train, might not work for profiles other than DB
     */
    @Query() station?: EvaNumber,
    /**
     * This is the initialDepartureDate of your desired journey
     */
    @Query() date?: Date,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<ParsedSearchOnTripResponse> {
    const details = await Detail(trainName, stop, station, date, profile);

    if (!details) {
      return notFoundResponse(404);
    }
    return details;
  }
}
