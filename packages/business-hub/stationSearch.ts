import { axios } from 'business-hub';
import type {
  APIResult,
  BusinessHubCoordinates,
  BusinessHubStation,
  DetailBusinessHubStation,
  DetailsApiResult,
  StopPlace,
} from 'business-hub/types/StopPlaces';

const transformBusinessHubStation = (
  businessHubStation: Pick<StopPlace, 'name' | 'identifiers' | 'location'>
): BusinessHubStation => ({
  title: businessHubStation.name,
  id: businessHubStation.identifiers.find((i) => i.type === 'EVA')?.value || '',
  location: businessHubStation.location,
  ds100: businessHubStation.identifiers.find((i) => i.type === 'RIL100')?.value,
  stada: businessHubStation.identifiers.find((i) => i.type === 'STADA')?.value,
  globalId: businessHubStation.identifiers.find((i) => i.type === 'GLOBAL_ID')
    ?.value,
});
function filterApiResult(result: APIResult) {
  return (
    result?._embedded?.stopPlaceList
      ?.map(transformBusinessHubStation)
      .filter((s) => s.id && s.ds100) ?? []
  );
}
export async function stationSearch(
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

export async function geoSearch(
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
