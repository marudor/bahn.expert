import request, { Canceler } from 'umi-request';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';

export default async function getDetails(
  train: string,
  initialDeparture?: string,
  stop?: string,
  stationId?: string,
  profile?: AllowedHafasProfile
): Promise<ParsedSearchOnTripResponse> {
  const details = await request.get<ParsedSearchOnTripResponse>(
    `/api/hafas/v1/details/${train}`,
    {
      params: {
        stop,
        station: stationId,
        profile,
        date: initialDeparture,
      },
    }
  );

  return details;
}

const journeyMatchCanelTokens: { [key: string]: Canceler } = {};

export async function journeyMatch(
  trainName: string,
  initialDepartureDate?: number,
  profile?: AllowedHafasProfile,
  cancelIdent?: string
): Promise<ParsedJourneyMatchResponse[]> {
  let cancelToken;

  if (cancelIdent) {
    journeyMatchCanelTokens[cancelIdent]?.();
    const { cancel, token } = request.CancelToken.source();
    cancelToken = token;
    journeyMatchCanelTokens[cancelIdent] = cancel;
  }
  const matches = await request.post<ParsedJourneyMatchResponse[]>(
    '/api/hafas/v1/enrichedJourneyMatch',
    {
      data: {
        trainName,
        initialDepartureDate,
      },
      cancelToken,
      params: {
        profile,
      },
    }
  );

  return matches;
}
