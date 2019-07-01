import { ParsedSearchOnTripResponse } from 'types/HAFAS/SearchOnTrip';
import axios from 'axios';

export default async function getDetails(
  train: string,
  initialDeparture: string,
  stop?: string
): Promise<ParsedSearchOnTripResponse> {
  const details = (await axios.get(
    `/api/hafas/current/details/${train}/${initialDeparture}`,
    {
      params: {
        stop,
      },
    }
  )).data;

  return details;
}
