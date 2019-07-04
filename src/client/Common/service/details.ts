import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import axios from 'axios';

export default async function getDetails(
  train: string,
  initialDeparture?: string,
  stop?: string
): Promise<ParsedSearchOnTripResponse> {
  let url = `/api/hafas/current/details/${train}`;

  if (initialDeparture) {
    url += `/${initialDeparture}`;
  }
  const details = (await axios.get(url, {
    params: {
      stop,
    },
  })).data;

  return details;
}
