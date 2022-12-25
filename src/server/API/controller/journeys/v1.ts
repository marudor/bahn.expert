import {
  Controller,
  Get,
  Hidden,
  Query,
  Request,
  Res,
  Response,
  Route,
  Tags,
} from '@tsoa/runtime';
import { enrichedJourneyMatch } from 'server/HAFAS/JourneyMatch';
import {
  findJourney,
  findJourneyHafasCompatible,
} from 'business-hub/risJourneys';
import {
  getCategoryAndNumberFromName,
  journeyDetails,
} from 'server/journeys/journeyDetails';
import Detail from 'server/HAFAS/Detail';
import type { EvaNumber } from 'types/common';
import type { Request as KoaRequest } from 'koa';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import type { TsoaResponse } from '@tsoa/runtime';

const allowedReferer = ['https://bahn.expert', 'https://beta.bahn.expert'];
function isAllowed(req: KoaRequest) {
  // console.log(req);
  return (
    process.env.NODE_ENV !== 'production' ||
    allowedReferer.some((r) => req.headers.referer?.startsWith(r))
  );
}

@Route('/journeys/v1')
export class JourneysV1Controller extends Controller {
  @Hidden()
  @Get('/find/{trainName}')
  @Tags('Journeys')
  async find(
    @Request() req: KoaRequest,
    @Res() response: TsoaResponse<401, string>,
    trainName: string,
    @Query() initialDepartureDate?: Date,
    @Query() initialEvaNumber?: string,
    // Only FV, legacy reasons for hafas compatibility
    @Query() filtered?: boolean,
    @Query() limit?: number,
  ): Promise<ParsedJourneyMatchResponse[]> {
    if (!isAllowed(req)) {
      return response(
        401,
        'This is rate-limited upstream, please do not use it.',
      );
    }
    let risPromise: Promise<ParsedJourneyMatchResponse[]> = Promise.resolve([]);
    const productDetails = getCategoryAndNumberFromName(trainName);
    if (productDetails) {
      risPromise = findJourneyHafasCompatible(
        productDetails.trainNumber,
        productDetails.category,
        initialDepartureDate,
        filtered,
      );
    }
    const hafasPromise = enrichedJourneyMatch({
      onlyRT: true,
      jnyFltrL: filtered
        ? [
            {
              mode: 'INC',
              type: 'PROD',
              value: '7',
            },
          ]
        : undefined,
      trainName,
      initialDepartureDate,
      limit,
    });

    const risResult = await risPromise;

    let result = risResult.length ? risResult : await hafasPromise;
    if (initialEvaNumber) {
      result = result.filter(
        (r) => r.firstStop.station.id === initialEvaNumber,
      );
    }

    return result.slice(0, limit);
  }

  @Hidden()
  @Get('/details/{trainName}')
  @Response(404)
  @Tags('Journeys')
  async details(
    @Request() req: KoaRequest,
    @Res() res: TsoaResponse<401 | 404, unknown>,
    trainName: string,
    @Query() evaNumberAlongRoute?: EvaNumber,
    @Query() initialDepartureDate?: Date,
    @Query() journeyId?: string,
  ): Promise<ParsedSearchOnTripResponse> {
    if (!isAllowed(req)) {
      return res(401, 'This is rate-limited upstream, please do not use it.');
    }
    const hafasDetailsPromise = Detail(
      trainName,
      undefined,
      evaNumberAlongRoute,
      initialDepartureDate,
    );
    const hafasFallback = async () => {
      const hafasResult = await hafasDetailsPromise;
      if (!hafasResult) {
        return res(404, undefined);
      }
      return hafasResult;
    };
    if (journeyId) {
      const journey = await journeyDetails(journeyId);
      return journey || hafasFallback();
    }
    const productDetails = getCategoryAndNumberFromName(trainName);
    if (!productDetails) {
      return hafasFallback();
    }
    const possibleJourneys = await findJourney(
      productDetails.trainNumber,
      productDetails.category,
      initialDepartureDate,
      false,
    );
    if (!possibleJourneys.length) {
      return hafasFallback();
    }
    let foundJourney: ParsedSearchOnTripResponse | undefined;
    if (possibleJourneys.length > 1 && evaNumberAlongRoute) {
      const allJourneys = (
        await Promise.all(
          possibleJourneys.map((j) => journeyDetails(j.journeyID)),
        )
      ).filter(Boolean);
      foundJourney = allJourneys.find((j) =>
        j.stops.map((s) => s.station.id).includes(evaNumberAlongRoute),
      );
    } else {
      foundJourney = await journeyDetails(possibleJourneys[0].journeyID);
    }
    if (!foundJourney) {
      return hafasFallback();
    }

    return foundJourney;
  }
}
