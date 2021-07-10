import { formatISO } from 'date-fns';
import { request } from './request';
import type { OccupancyResponse } from 'business-hub/types/Occupancy';

export const stationOccupancy = async (
  evaId: string,
  date: Date,
): Promise<OccupancyResponse> => {
  const occupancy = (
    await request.get<OccupancyResponse>(
      `/public-transport-stations/v1/stop-places/${evaId}/occupancy/${formatISO(
        date,
        {
          representation: 'date',
        },
      )}`,
    )
  ).data;

  return occupancy;
};
