import {
  Controller,
  Get,
  OperationId,
  Query,
  Route,
  Tags,
} from '@tsoa/runtime';
import { getAbfahrten } from 'server/iris';
import type { AbfahrtenResult } from 'types/iris';
import type { EvaNumber } from 'types/common';

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
  abfahrten(
    evaNumber: EvaNumber,
    /** minutes */
    @Query() lookahead = 150,
    /** minutes */
    @Query() lookbehind = 0,
  ): Promise<AbfahrtenResult> {
    return getAbfahrten(evaNumber, true, {
      lookahead,
      lookbehind,
    });
  }
}
