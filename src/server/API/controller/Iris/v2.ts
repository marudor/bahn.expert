import {
  Controller,
  Get,
  OperationId,
  Query,
  Route,
  Tags,
} from '@tsoa/runtime';
import { getAbfahrten } from '@/server/iris';
import { getPrivateAbfahrten } from '@/server/boards';
import type { AbfahrtenResult } from '@/types/iris';
import type { EvaNumber } from '@/types/common';

@Route('/iris/v2')
export class IrisControllerv2 extends Controller {
  /**
   *
   * @isInt lookahead
   * @isInt lookbehind
   */
  @Get('/abfahrten/{evaNumber}')
  @Tags('IRIS')
  @OperationId('Abfahrten v2')
  async abfahrten(
    evaNumber: EvaNumber,
    /** minutes */
    @Query() lookahead = 150,
    /** minutes */
    @Query() lookbehind = 0,
    @Query() startTime?: Date,
    @Query() allowBoards?: boolean,
  ): Promise<AbfahrtenResult> {
    if (allowBoards) {
      try {
        const departures = await getPrivateAbfahrten(
          evaNumber,
          lookahead,
          lookbehind,
          startTime,
        );

        return departures;
      } catch {
        // we just ignore this
      }
    }
    return getAbfahrten(evaNumber, true, {
      lookahead,
      lookbehind,
      startTime,
    });
  }
}
