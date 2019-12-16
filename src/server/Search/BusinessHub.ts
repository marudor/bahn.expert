import { APIResult, BusinessHubStation } from 'types/BusinessHub/StopPlaces';
import axios from 'axios';

const baseUrl = 'https://api.businesshub.deutschebahn.com/';
const apiKey = process.env.BUSINESS_HUB_STOP_PLACES_KEY || '';

export const canUseBusinessHub = Boolean(apiKey);

export default async (
  searchTerm: string,
  needsDS100: boolean = true
): Promise<BusinessHubStation[]> => {
  const result: APIResult = (
    await axios.get(`${baseUrl}public-transport-stations/v1/stop-places`, {
      headers: {
        key: apiKey,
      },
      params: {
        name: searchTerm,
      },
    })
  ).data;

  // eslint-disable-next-line no-underscore-dangle
  return result._embedded.stopPlaceList
    .map(businessHubStation => ({
      title: businessHubStation.name,
      id:
        businessHubStation.identifiers.find(i => i.type === 'EVA')?.value || '',
      location: businessHubStation.location,
      ds100: businessHubStation.identifiers.find(i => i.type === 'RIL100')
        ?.value,
      stada: businessHubStation.identifiers.find(i => i.type === 'STADA')
        ?.value,
    }))
    .filter(s => s.id && (!needsDS100 || s.ds100));
};
