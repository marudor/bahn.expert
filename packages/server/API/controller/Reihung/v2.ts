import {
  Controller,
  Deprecated,
  Get,
  OperationId,
  Request,
  Route,
  Tags,
} from 'tsoa';
import { deprecatedAPIUsage } from 'server/plausible';
import { wagenreihung } from 'server/Reihung';
import type { Formation } from 'types/reihung';
import type { Request as KRequest } from 'koa';

@Route('/reihung/v2')
export class ReihungControllerV2 extends Controller {
  @Get('/wagen/{trainNumber}/{date}')
  @Tags('Reihung')
  @OperationId('Wagenreihung v2')
  @Deprecated()
  async wagenreihung(
    @Request() req: KRequest,
    trainNumber: string,
    date: Date,
  ): Promise<Formation> {
    deprecatedAPIUsage(req, 'wagenreihung v2');
    return wagenreihung(trainNumber, date);
  }
}
