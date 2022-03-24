import { Controller, Get, OperationId, Query, Route, Tags } from 'tsoa';
import { getAbfahrten } from 'server/iris';
import wingInfo from 'server/iris/wings';
import type { AbfahrtenResult, WingDefinition } from 'types/iris';
import type { EvaNumber } from 'types/common';

@Route('/iris/v2')
export class IrisControllerv2 extends Controller {
  @Get('/wings/{rawId1}/{rawId2}')
  @Tags('IRIS')
  @OperationId('WingInfo v2')
  wings(rawId1: string, rawId2: string): Promise<WingDefinition> {
    return wingInfo(rawId1, rawId2);
  }

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
