import {
  Body,
  Controller,
  Get,
  Hidden,
  OperationId,
  Post,
  Query,
  Res,
  Response,
  Route,
  Tags,
} from '@tsoa/runtime';
import { getAbfahrten } from 'server/iris';
import { getFreitexte, matchFreitexte } from 'server/iris/freitext';
import wingInfo from 'server/iris/wings';
import type {
  AbfahrtenResult,
  IrisMessage,
  MatchedIrisMessage,
  WingDefinition,
} from 'types/iris';
import type { EvaNumber } from 'types/common';
import type { TsoaResponse } from '@tsoa/runtime';

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

  @Response(404)
  @Hidden()
  @Post(
    '/freitext/{trainNumber}/{initialDepartureDate}/{initialDepartureEvaNumber}',
  )
  async matchMessagesToFreitext(
    trainNumber: string,
    initialDepartureDate: Date,
    initialDepartureEvaNumber: string,
    @Body() messages: IrisMessage[],
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<MatchedIrisMessage[]> {
    const freitexte = await getFreitexte(
      initialDepartureDate,
      initialDepartureEvaNumber,
      trainNumber,
    );
    if (!freitexte) {
      return notFoundResponse(404);
    }

    return matchFreitexte(freitexte, messages);
  }
}
