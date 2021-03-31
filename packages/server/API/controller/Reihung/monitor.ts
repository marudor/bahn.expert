import { Controller, Get, Hidden, Res, Route } from 'tsoa';
import { wagenReihungMonitoring } from 'server/Reihung';
import type { Formation } from 'types/reihung';
import type { TsoaResponse } from 'tsoa';

@Route('/reihung/monitoring')
export class ReihungMonitoringController extends Controller {
  @Get('/wagen')
  @Hidden()
  async monitoring(
    @Res() notFoundResponse: TsoaResponse<404, void>,
  ): Promise<Formation> {
    const reihung = await wagenReihungMonitoring();

    if (!reihung) {
      return notFoundResponse(404);
    }

    return reihung;
  }
}
