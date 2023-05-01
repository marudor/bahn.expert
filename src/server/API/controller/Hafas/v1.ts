import {
  Body,
  Controller,
  Get,
  Hidden,
  Post,
  Query,
  Res,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from '@tsoa/runtime';
import JourneyDetails from '@/server/HAFAS/JourneyDetails';
import makeRequest from '@/server/HAFAS/Request';
import type { AllowedHafasProfile } from '@/types/HAFAS';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/hafas/v1')
export class HafasController extends Controller {
  /**
   * This redirects to the current Details Page with a provided HAFAS TripId / JourneyId / JID
   */
  @SuccessResponse(302)
  @Response(500, 'Failed to fetch a journey for this tripId')
  @Tags('HAFAS')
  @Get('/detailsRedirect/{tripId}')
  async detailsRedirect(
    tripId: string,
    @Res() res: TsoaResponse<500 | 302, void>,
  ): Promise<void> {
    const hafasDetails = await JourneyDetails(tripId);
    if (!hafasDetails) return res(500);

    const trainName = `${hafasDetails.train.type} ${hafasDetails.train.number}`;
    const evaNumber = hafasDetails.stops[0].station.evaNumber;
    const date = hafasDetails.stops[0].departure?.scheduledTime;
    const dataUrlPart = date?.toISOString() || '';

    return res(302, undefined, {
      location: `/details/${trainName}/${dataUrlPart}?stopEva=${evaNumber}`,
    });
  }

  @Hidden()
  @Post('/rawHafas')
  rawHafas(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Body() body: any,
    @Query() profile?: AllowedHafasProfile,
  ): Promise<any> {
    return makeRequest(body, undefined, profile);
  }
}
