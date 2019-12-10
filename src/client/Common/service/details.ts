import { AllowedHafasProfile } from 'types/HAFAS';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import axios from 'axios';

export default async function getDetails(
  train: string,
  initialDeparture?: string,
  stop?: string,
  line?: string,
  profile?: AllowedHafasProfile
): Promise<ParsedSearchOnTripResponse> {
  const details = (
    await axios.get(`/api/hafas/v1/details/${train}`, {
      params: {
        stop,
        line,
        profile,
        date: initialDeparture,
      },
    })
  ).data;

  return details;
}
