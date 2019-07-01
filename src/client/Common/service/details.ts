import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import axios from 'axios';

export default async function getDetails(
  train: string,
  initialDeparture?: string,
  stop?: string
): Promise<null | ParsedSearchOnTripResponse> {
  let url = `/api/hafas/current/details/${train}`;

  if (initialDeparture) {
    url += `/${initialDeparture}`;
  }
  try {
    const details = (await axios.get(url, {
      params: {
        stop,
      },
    })).data;

    return details;
  } catch (e) {
    return null;
  }
}
