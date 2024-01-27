import { Controller, Get, Hidden, Route } from '@tsoa/runtime';
import { getJourneyDetails } from '@/external/risJourneys';
import { TransportType } from '@/external/generated/risJourneys';
import { v4 } from 'uuid';
import axios from 'axios';

const transportTypeMap: Record<string, string> = {
  [TransportType.CityTrain]: 'SBAHNEN',
  [TransportType.Bus]: 'BUSSE',
  [TransportType.HighSpeedTrain]: 'HOCHGESCHWINDIGKEITSZUEGE',
  [TransportType.IntercityTrain]: 'INTERCITYUNDEUROCITYZUEGE',
  [TransportType.InterRegionalTrain]: 'INTERREGIOUNDSCHNELLZUEGE',
  [TransportType.RegionalTrain]: 'NAHVERKEHRSONSTIGEZUEGE',
  [TransportType.Ferry]: 'SCHIFFE',
  [TransportType.Subway]: 'UBAHN',
  [TransportType.Tram]: 'STRASSENBAHN',
};

@Hidden()
@Route('/hafas/v4')
export class HafasControllerV4 extends Controller {
  @Get('/idDetails/{id}')
  async idDetails(id: string): Promise<any> {
    const { data: details } = await axios.get(
      `https://app.vendo.noncd.db.de/mob/zuglauf/${encodeURIComponent(id)}`,
      {
        headers: {
          'X-Correlation-ID': `${v4()}_${v4()}`,
          'User-Agent': 'okhttp/4.11.0',
          Accept: 'application/x.db.vendo.mob.zuglauf.v1+json',
          'Content-Type': 'application/x.db.vendo.mob.zuglauf.v1+json',
        },
      },
    );

    details.zuglaufId = id;
    return details;
  }

  @Get('/detailsByJourney/{journeyId}')
  async details(journeyId: string): Promise<any> {
    const journey = await getJourneyDetails(journeyId);
    if (!journey) {
      return null;
    }

    const mappedTransportType =
      transportTypeMap[journey.events[0].transport.type];

    const { data: trips } = await axios.post(
      'https://app.vendo.noncd.db.de/mob/angebote/fahrplan',
      {
        klasse: 'KLASSE_2',
        reiseHin: {
          wunsch: {
            verkehrsmittel: mappedTransportType && [mappedTransportType],
            maxUmstiege: 0,
            abgangsLocationId: `A=1@L=${journey.events[0].station.evaNumber}`,
            // 'A=1@O=Karlsruhe Hbf@X=8402181@Y=48993512@U=80@L=8000191@B=1@p=1692821240@',
            zeitWunsch: {
              reiseDatum: journey.events[0].timeSchedule,
              zeitPunktArt: 'ABFAHRT',
            },
            zielLocationId: `A=1@L=${journey.events.at(-1)!.station.evaNumber}`,
            // 'A=1@O=Frankfurt(Main)Hbf@X=8663785@Y=50107149@U=80@L=8000105@B=1@p=1692821240@',
          },
        },
        reisendenProfil: {
          reisende: [
            {
              ermaessigungen: ['KEINE_ERMAESSIGUNG KLASSENLOS'],
              reisendenTyp: 'ERWACHSENER',
            },
          ],
        },
        reservierungsKontingenteVorhanden: false,
      },
      {
        headers: {
          'X-Correlation-ID': `${v4()}_${v4()}`,
          'User-Agent': 'okhttp/4.11.0',
          Accept: 'application/x.db.vendo.mob.verbindungssuche.v4+json',
          'Content-Type': 'application/x.db.vendo.mob.verbindungssuche.v4+json',
        },
      },
    );

    const matchingTrip = trips.verbindungen.find((v: any) =>
      v.verbindung.verbindungsAbschnitte.some((a: any) =>
        a.risZuglaufId?.endsWith(journey.events[0].transport.number),
      ),
    );

    const matchingSegment = matchingTrip.verbindung.verbindungsAbschnitte.find(
      (a: any) => a.risZuglaufId?.endsWith(journey.events[0].transport.number),
    );

    return this.idDetails(matchingSegment.zuglaufId);
  }
}
