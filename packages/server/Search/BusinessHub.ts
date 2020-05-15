import Axios from 'axios';
import type {
  APIResult,
  BusinessHubCoordinates,
  BusinessHubStation,
  DetailBusinessHubStation,
  DetailsApiResult,
  StopPlace,
} from 'types/BusinessHub/StopPlaces';

const apiKey = process.env.BUSINESS_HUB_STOP_PLACES_KEY || '';

export const canUseBusinessHub =
  Boolean(apiKey) || process.env.NODE_ENV === 'test';
const axios = Axios.create({
  headers: {
    key: apiKey,
  },
  baseURL: 'https://api.businesshub.deutschebahn.com/',
});

if (!canUseBusinessHub) {
  console.warn(
    'No BusinessHub API Key provided. Station search will be degraded Quality!'
  );
}

const transformBusinessHubStation = (
  businessHubStation: Pick<StopPlace, 'name' | 'identifiers' | 'location'>
): BusinessHubStation => ({
  title: businessHubStation.name,
  id: businessHubStation.identifiers.find((i) => i.type === 'EVA')?.value || '',
  location: businessHubStation.location,
  ds100: businessHubStation.identifiers.find((i) => i.type === 'RIL100')?.value,
  stada: businessHubStation.identifiers.find((i) => i.type === 'STADA')?.value,
});

function filterApiResult(result: APIResult) {
  return (
    result?._embedded?.stopPlaceList
      ?.map(transformBusinessHubStation)
      .filter((s) => s.id && s.ds100) ?? []
  );
}

export async function BusinessHubSearch(
  searchTerm?: string
): Promise<BusinessHubStation[]> {
  if (!searchTerm) return [];
  const result: APIResult = (
    await axios.get('/public-transport-stations/v1/stop-places', {
      params: {
        name: searchTerm,
      },
    })
  ).data;

  return filterApiResult(result);
}

export async function BusinessHubGeoSearch(
  coordinates: BusinessHubCoordinates,
  radius: number = 3000
): Promise<BusinessHubStation[]> {
  const result: APIResult = (
    await axios.get('/public-transport-stations/v1/stop-places', {
      params: {
        ...coordinates,
        radius,
      },
    })
  ).data;

  return filterApiResult(result);
}

export const stationDetails = async (
  evaId: string
): Promise<DetailBusinessHubStation> => {
  const detailsResult: DetailsApiResult = (
    await axios.get(`/public-transport-stations/v1/stop-places/${evaId}`)
  ).data;

  const { _embedded, _links, name, ...relevantDetails } = detailsResult;

  const businessHubStation = transformBusinessHubStation(detailsResult);

  return {
    ...businessHubStation,
    ...relevantDetails,
    tripleSCenter: _embedded?.tripleSCenter,
  };
};
