import { Controller, Get, Hidden, Query, Route } from '@tsoa/runtime';
import { enrichedJourneyMatch } from 'server/HAFAS/JourneyMatch';
import { findJourneyHafasCompatible } from 'business-hub/risJourneys';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';

const trainNumberRegex = /(.*?)(\d+).*/;

@Route('/journeys/v1')
export class JourneysV1Controller extends Controller {
  @Hidden()
  @Get('/find/{trainName}')
  async find(
    trainName: string,
    @Query() initialDepartureDate?: Date,
    // Only FV, legacy reasons for hafas compatibility
    @Query() filtered?: boolean,
    @Query() limit?: number,
  ): Promise<ParsedJourneyMatchResponse[]> {
    let risPromise: Promise<ParsedJourneyMatchResponse[]> = Promise.resolve([]);
    const regexResult = trainNumberRegex.exec(trainName);
    const trainNumber = Number.parseInt(regexResult?.[2].trim() || '');
    const category = regexResult?.[1]?.trim();
    if (!Number.isNaN(trainNumber)) {
      risPromise = findJourneyHafasCompatible(
        trainNumber,
        category,
        initialDepartureDate,
        filtered,
      );
    }
    const risResult = await risPromise;
    if (risResult.length) {
      return risResult.slice(0, limit);
    }
    return enrichedJourneyMatch({
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
  }
}
