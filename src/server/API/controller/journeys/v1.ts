import {
  Controller,
  Get,
  Query,
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
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import type { TsoaResponse } from '@tsoa/runtime';

@Route('/journeys/v1')
export class JourneysV1Controller extends Controller {
  @Get('/find/{trainName}')
  @Tags('Journeys')
  async find(
    trainName: string,
    @Query() initialDepartureDate?: Date,
    // Only FV, legacy reasons for hafas compatibility
    @Query() filtered?: boolean,
    @Query() limit?: number,
  ): Promise<ParsedJourneyMatchResponse[]> {
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

    if (risResult.length) {
      return risResult.slice(0, limit);
    }

    return await hafasPromise;
  }

  @Get('/details/{trainName}')
  @Response(404)
  @Tags('Journeys')
  async details(
    @Res() notFoundResponse: TsoaResponse<404, void>,
    trainName: string,
    @Query() evaNumberAlongRoute?: EvaNumber,
    @Query() initialDepartureDate?: Date,
  ): Promise<ParsedSearchOnTripResponse> {
    const hafasDetailsPromise = Detail(
      trainName,
      undefined,
      evaNumberAlongRoute,
      initialDepartureDate,
    );
    const hafasFallback = async () => {
      const hafasResult = await hafasDetailsPromise;
      if (!hafasResult) {
        return notFoundResponse(404);
      }
      return hafasResult;
    };
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
