import Axios from 'axios';
import type { AllowedHafasProfile } from 'types/HAFAS';
import type { Canceler } from 'axios';
import type {
  EnrichedJourneyMatchOptions,
  ParsedJourneyMatchResponse,
} from 'types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';

export async function getDetails(
  train: string,
  initialDeparture?: Date,
  stop?: string,
  stationId?: string,
  profile?: AllowedHafasProfile,
): Promise<ParsedSearchOnTripResponse> {
  const r = await Axios.get<ParsedSearchOnTripResponse>(
    `/api/hafas/v2/details/${train}`,
    {
      params: {
        stop,
        station: stationId,
        profile,
        date: initialDeparture,
      },
    },
  );

  return r.data;
}

const journeyMatchCancelTokens: { [key: string]: Canceler } = {};

export async function journeyMatch(
  trainName: string,
  initialDepartureDate?: Date,
  filtered?: boolean,
  profile?: AllowedHafasProfile,
  cancelIdent?: string,
): Promise<ParsedJourneyMatchResponse[]> {
  let cancelToken;

  if (cancelIdent) {
    journeyMatchCancelTokens[cancelIdent]?.();
    cancelToken = new Axios.CancelToken((c) => {
      journeyMatchCancelTokens[cancelIdent] = c;
    });
  }
  const body: EnrichedJourneyMatchOptions = {
    trainName,
    initialDepartureDate,
    limit: 5,
    filtered,
  };
  const r = await Axios.post<ParsedJourneyMatchResponse[]>(
    '/api/hafas/v1/enrichedJourneyMatch',
    body,
    {
      cancelToken,
      params: {
        profile,
      },
    },
  );

  return r.data;
}
