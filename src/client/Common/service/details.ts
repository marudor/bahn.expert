import Axios, { Canceler } from 'axios';
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
  const details = (
    await Axios.get(`/api/hafas/v1/details/${train}`, {
      params: {
        stop,
        station: stationId,
        profile,
        date: initialDeparture,
      },
    })
  ).data;

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
    cancelToken = new Axios.CancelToken((c) => {
      journeyMatchCanelTokens[cancelIdent] = c;
    });
  }
  const matches = (
    await Axios.post(
      '/api/hafas/v1/enrichedJourneyMatch',
      {
        trainName,
        initialDepartureDate,
      },
      {
        cancelToken,
        params: {
          profile,
        },
      }
    )
  ).data;

  return matches;
}
