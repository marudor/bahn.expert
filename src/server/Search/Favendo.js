// @flow
import axios from 'axios';
import type { Station } from 'types/abfahrten';

function encodeSearchTerm(term: string) {
  return term
    .replace(/ü/g, 'ue')
    .replace(/Ü/g, 'UE')
    .replace(/ä/g, 'ae')
    .replace(/Ä/g, 'AE')
    .replace(/ö/g, 'oe')
    .replace(/Ö/g, 'OE')
    .replace(/ß/g, 'ss')
    .replace(/%2F/g, '/');
}

// https://si.favendo.de/station-info/rest/api/search?searchTerm=Bochum
export default async function(searchTerm: string): Promise<Station[]> {
  const stations = (await axios.get(
    `https://si.favendo.de/station-info/rest/api/search?searchTerm=${encodeSearchTerm(searchTerm)}`
  )).data;

  return stations.map(s => ({
    title: s.title,
    id: s.eva_ids.shift(),
    favendoId: s.id,
    raw: PROD ? undefined : s,
  }));
}
