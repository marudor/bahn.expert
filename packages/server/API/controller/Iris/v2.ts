import { Controller, Get, OperationId, Query, Route, Tags } from 'tsoa';
import { getAbfahrten } from 'server/iris';
import { noncdRequest, openDataRequest } from 'server/iris/helper';
import wingInfo from 'server/iris/wings';
import type { AbfahrtenResult, WingDefinition } from 'types/iris';

@Route('/iris/v2')
export class IrisControllerv2 extends Controller {
  @Get('/wings/{rawId1}/{rawId2}')
  @Tags('IRIS')
  @OperationId('WingInfo v2')
  wings(rawId1: string, rawId2: string): Promise<WingDefinition> {
    return wingInfo(rawId1, rawId2);
  }

  @Get('/abfahrten/{evaId}')
  @Tags('IRIS')
  @OperationId('Abfahrten v2')
  abfahrten(
    evaId: string,
    /**
     * in Minutes
     */
    @Query() lookahead?: number,
    /**
     * in Minutes
     */
    @Query() lookbehind?: number,
    @Query() type?: 'open' | 'default',
  ): Promise<AbfahrtenResult> {
    if (evaId.length < 6) {
      throw {
        status: 400,
        error: 'Please provide a evaID',
      };
    }

    return getAbfahrten(
      evaId,
      true,
      {
        lookahead,
        lookbehind,
      },
      type === 'open' ? openDataRequest : noncdRequest,
    );
  }
}
