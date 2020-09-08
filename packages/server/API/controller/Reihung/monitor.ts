import { Controller, Get, Hidden, Route } from 'tsoa';
import { wagenReihungMonitoring } from 'server/Reihung';
import type { Formation } from 'types/reihung';

@Route('/reihung/monitoring')
export class ReihungMonitoringController extends Controller {
  @Get('/wagen')
  @Hidden()
  async monitoring(): Promise<Formation> {
    const reihung = await wagenReihungMonitoring();

    if (!reihung) {
      this.setStatus(404);
    }

    return reihung;
  }
}
