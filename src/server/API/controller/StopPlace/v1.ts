import { AuslastungsValue } from '@/types/routing';
import {
  Controller,
  Get,
  Hidden,
  OperationId,
  Query,
  Res,
  Response,
  Route,
  Tags,
} from '@tsoa/runtime';
import { getLageplan } from '@/server/StopPlace/Lageplan';
import {
  getStopPlaceByEva,
  getStopPlaceByRl100,
  searchStopPlace,
} from '@/server/StopPlace/search';
import axios from 'axios';
import type { EvaNumber } from '@/types/common';
import type {
  GroupedStopPlace,
  TrainOccupancy,
  TrainOccupancyList,
  VRRTrainOccupancy,
  VRRTrainOccupancyValues,
} from '@/types/stopPlace';
import type { LageplanResponse } from '@/types/bahnhof';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/stopPlace/v1')
export class StopPlaceController extends Controller {
  /**
   *
   * @returns URL to DB, HVV or NAHSH Lageplan
   */
  @Get('/lageplan/{stopPlaceName}/{evaNumber}')
  @Tags('StopPlace')
  @OperationId('Lageplan')
  async lageplan(
    stopPlaceName: string,
    evaNumber: EvaNumber,
  ): Promise<LageplanResponse> {
    const lageplan = await getLageplan(stopPlaceName, evaNumber);
    return {
      lageplan,
    };
  }
  /**
   * This might fall back to use HAFAS
   * @isInt max
   */
  @Get('/search/{searchTerm}')
  @Tags('StopPlace')
  async stopPlaceSearch(
    searchTerm: string,
    @Query() max?: number,
    /** Only returns stopPlaces iris-tts can handle (/abfahrten) */
    @Query() filterForIris = false,
    @Query() groupedBySales = false,
  ): Promise<GroupedStopPlace[]> {
    return await searchStopPlace(
      searchTerm,
      max,
      filterForIris,
      groupedBySales,
    );
  }

  @Response(404)
  @Get('/{evaNumberOrRl100}')
  @Tags('StopPlace')
  async stopPlaceByEvaOrRl100(
    evaNumberOrRl100: string,
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<GroupedStopPlace> {
    let stopPlace = await getStopPlaceByRl100(evaNumberOrRl100);
    if (!stopPlace) {
      stopPlace = await getStopPlaceByEva(evaNumberOrRl100);
    }
    if (!stopPlace) {
      return notFoundResponse(404);
    }
    return stopPlace;
  }

  @Hidden()
  @Response(404)
  @Get('/{evaNumber}/live')
  @Tags('StopPlace')
  async stopPlaceByEvaLive(
    evaNumber: EvaNumber,
    @Res() notFoundResponse: TsoaResponse<404, void>,
    @Res() notAuthorized: TsoaResponse<401, void>,
  ): Promise<GroupedStopPlace> {
    try {
      const stopPlace = await getStopPlaceByEva(evaNumber, true);
      if (!stopPlace) {
        return notFoundResponse(404);
      }
      return stopPlace;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        return notAuthorized(401);
      }
      return notFoundResponse(404);
    }
  }

  /**
   * Currently only for VRR. <br>
   * Source: https://github.com/derf/eva-to-efa-gw<br>
   * Thanks derf.
   */
  @Response(404)
  @Get('/{evaNumber}/trainOccupancy')
  @Tags('StopPlace')
  async trainOccupancy(
    evaNumber: EvaNumber,
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<TrainOccupancyList> {
    try {
      const result = (
        await axios.get<TrainOccupancy<VRRTrainOccupancy>>(
          `https://vrrf.finalrewind.org/_eva/occupancy-by-eva/${evaNumber}.json`,
        )
      ).data;

      const normalizedResult: TrainOccupancyList = {};
      for (const [trainNumber, vrrOccupancy] of Object.entries(result.train)) {
        normalizedResult[trainNumber] = vrrOccupancy?.occupancy
          ? {
              first: mapVrrOccupancy(vrrOccupancy.occupancy),
              second: mapVrrOccupancy(vrrOccupancy.occupancy),
            }
          : null;
      }

      return normalizedResult;
    } catch {
      return notFoundResponse(404);
    }
  }
}

function mapVrrOccupancy(
  vrrOccupancy: VRRTrainOccupancyValues,
): AuslastungsValue {
  switch (vrrOccupancy) {
    case 1:
      return AuslastungsValue.Gering;
    case 2:
      return AuslastungsValue.Hoch;
    case 3:
      return AuslastungsValue.SehrHoch;
  }
}
