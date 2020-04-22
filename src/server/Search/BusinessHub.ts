import {
  APIResult,
  BusinessHubCoordinates,
  BusinessHubStation,
  DetailBusinessHubStation,
  DetailsApiResult,
  StopPlace,
} from 'types/BusinessHub/StopPlaces';

import axios from 'axios';

const baseUrl = 'https://api.businesshub.deutschebahn.com/';
const apiKey = process.env.BUSINESS_HUB_STOP_PLACES_KEY || '';

export const canUseBusinessHub =
  Boolean(apiKey) || process.env.NODE_ENV === 'test';

const transformBusinessHubStation = (
  businessHubStation: Pick<StopPlace, 'name' | 'identifiers' | 'location'>
): BusinessHubStation => ({
  title: businessHubStation.name,
  id: businessHubStation.identifiers.find((i) => i.type === 'EVA')?.value || '',
  location: businessHubStation.location,
  ds100: businessHubStation.identifiers.find((i) => i.type === 'RIL100')?.value,
  stada: businessHubStation.identifiers.find((i) => i.type === 'STADA')?.value,
});

export default async (
  searchTerm?: string,
  needsDS100: boolean = true,
  coordinates?: BusinessHubCoordinates
): Promise<BusinessHubStation[]> => {
  const result: APIResult = (
    await axios.get(`${baseUrl}public-transport-stations/v1/stop-places`, {
      headers: {
        key: apiKey,
      },
      params: coordinates
        ? {
            ...coordinates,
            radius: 3000,
          }
        : {
            name: searchTerm,
          },
    })
  ).data;

  return (
    result?._embedded?.stopPlaceList
      ?.map(transformBusinessHubStation)
      .filter((s) => s.id && (!needsDS100 || s.ds100)) ?? []
  );
};

export const stationDetails = async (
  evaId: string
): Promise<DetailBusinessHubStation> => {
  const detailsResult: DetailsApiResult = (
    await axios.get(
      `${baseUrl}public-transport-stations/v1/stop-places/${evaId}`,
      {
        headers: {
          key: apiKey,
        },
      }
    )
  ).data;

  const { _embedded, _links, name, ...relevantDetails } = detailsResult;

  const businessHubStation = transformBusinessHubStation(detailsResult);

  return {
    ...businessHubStation,
    ...relevantDetails,
    tripleSCenter: _embedded?.tripleSCenter,
  };
};
