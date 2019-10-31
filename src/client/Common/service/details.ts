import { AllowedHafasProfile } from 'types/HAFAS';
import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import axios from 'axios';

export default async function getDetails(
  train: string,
  initialDeparture?: string,
  stop?: string,
  profile?: AllowedHafasProfile
): Promise<ParsedSearchOnTripResponse> {
  let url = `/api/hafas/v1/details/${train}`;

  if (initialDeparture) {
    url += `/${initialDeparture}`;
  }
  const details = (await axios.get(url, {
    params: {
      stop,
      profile,
    },
  })).data;

  return details;
}
