import { Controller, Get, Hidden, Route } from 'tsoa';
import { wagenReihungMonitoring } from 'server/Reihung';

@Route('/reihung/monitoring')
export class ReihungMonitoringController extends Controller {
  @Get('/wagen')
  @Hidden()
  monitoring() {
    const reihung = wagenReihungMonitoring();

    if (!reihung) {
      this.setStatus(404);
    }

    return reihung;
  }
}
