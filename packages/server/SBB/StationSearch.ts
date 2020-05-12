import { axios } from './request';
import type { SBBStation, SBBStationResult } from 'types/SBB/station';

export default async (searchTerm?: string): Promise<SBBStation[]> => {
  const result = (
    await axios.get<SBBStationResult>(
      '/unauth/fahrplanservice/v1/standorte/' + searchTerm
    )
  ).data;

  return (
    result.standorte
      ?.filter((station) => station.externalId?.length >= 7)
      .map((station) => ({
        title: station.displayName,
        id: station.externalId,
        location: {
          latitude: station.latitude / 1000000,
          longitude: station.longitude / 1000000,
        },
      })) || []
  );
};
