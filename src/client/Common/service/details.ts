import { Route$JourneySegment } from 'types/routing';
import axios from 'axios';

export default async function getDetails(
  train: string,
  initialDeparture: string
): Promise<Route$JourneySegment> {
  const details = (await axios.get(
    `/api/hafas/current/details/${train}/${initialDeparture}`
  )).data;

  return details;
}
