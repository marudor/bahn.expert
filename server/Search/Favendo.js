// @flow
import axios from 'axios';
import type { Station } from 'types/abfahrten';

// https://si.favendo.de/station-info/rest/api/search?searchTerm=Bochum
export default async function(searchTerm: string): Promise<Station[]> {
  const stations = (await axios.get(`https://si.favendo.de/station-info/rest/api/search?searchTerm=${searchTerm}`))
    .data;

  return stations.map(s => ({
    title: s.title,
    id: s.eva_ids[0],
    favendoId: s.id,
  }));
}
