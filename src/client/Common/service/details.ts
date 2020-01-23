import { AllowedHafasProfile } from 'types/HAFAS';
import { ParsedJourneyMatchResponse } from 'types/HAFAS/JourneyMatch';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import axios from 'axios';

export default async function getDetails(
  train: string,
  initialDeparture?: string,
  stop?: string,
  stationId?: string,
  profile?: AllowedHafasProfile
): Promise<ParsedSearchOnTripResponse> {
  const details = (
    await axios.get(`/api/hafas/v1/details/${train}`, {
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

export async function journeyMatch(
  trainName: string,
  initialDepartureDate?: number,
  profile?: AllowedHafasProfile
): Promise<ParsedJourneyMatchResponse[]> {
  const matches = (
    await axios.post(
      '/api/hafas/v1/enrichedJourneyMatch',
      {
        trainName,
        initialDepartureDate,
      },
      {
        params: {
          profile,
        },
      }
    )
  ).data;

  return matches;
}
