import { Controller, Get, Hidden, Route } from 'tsoa';
import { wagenReihungMonitoring } from 'server/Reihung';

@Route('/reihung/monitoring')
export class ReihungMonitoringController extends Controller {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Get('/wagen')
  @Hidden()
  async monitoring() {
    const reihung = await wagenReihungMonitoring();

    if (!reihung) {
      this.setStatus(404);
    }

    return reihung;
  }
}
