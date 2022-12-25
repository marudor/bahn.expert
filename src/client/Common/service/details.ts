import Axios from 'axios';
import type { AdditionalJourneyInformation } from 'types/HAFAS/JourneyDetails';
import type { Canceler } from 'axios';
import type { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import type { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';

export async function getDetails(
  train: string,
  initialDepartureDate?: Date,
  evaNumberAlongRoute?: string,
): Promise<ParsedSearchOnTripResponse> {
  const r = await Axios.get<ParsedSearchOnTripResponse>(
    `/api/journeys/v1/details/${train}`,
    {
      params: {
        evaNumberAlongRoute,
        initialDepartureDate,
      },
    },
  );

  return r.data;
}

export async function getAdditionalJourneyInformation(
  trainName: string,
  journeyId: string,
  initialDepartureDate?: Date,
  evaNumberAlongRoute?: string,
): Promise<AdditionalJourneyInformation | undefined> {
  try {
    return (
      await Axios.get<AdditionalJourneyInformation>(
        `/api/hafas/v3/additionalInformation/${trainName}/${journeyId}`,
        {
          params: {
            evaNumberAlongRoute,
            initialDepartureDate,
          },
        },
      )
    ).data;
  } catch {
    return undefined;
  }
}

const journeyMatchCancelTokens: { [key: string]: Canceler } = {};

export async function journeyFind(
  trainName: string,
  initialDepartureDate?: Date,
  filtered?: boolean,
  cancelIdent?: string,
): Promise<ParsedJourneyMatchResponse[]> {
  let cancelToken;

  if (cancelIdent) {
    journeyMatchCancelTokens[cancelIdent]?.();
    cancelToken = new Axios.CancelToken((c) => {
      journeyMatchCancelTokens[cancelIdent] = c;
    });
  }
  const r = await Axios.get<ParsedJourneyMatchResponse[]>(
    `/api/journeys/v1/find/${trainName}`,
    {
      cancelToken,
      params: {
        initialDepartureDate,
        filtered,
        limit: 5,
      },
    },
  );

  return r.data;
}
