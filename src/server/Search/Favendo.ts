import axios from 'axios';
import type { Coordinates, FavendoStation, Station } from 'types/station';

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

// Can also handle lat&lng
// https://si.favendo.de/station-info/rest/api/search?searchTerm=Bochum&lat=42.00023&lng=23.00042
export default async function (
  searchTerm: string,
  coordinates?: Coordinates
): Promise<Station[]> {
  const stations = (
    await axios.get<FavendoStation[]>(
      'https://si.favendo.de/station-info/rest/api/search',
      {
        params: {
          searchTerm: encodeSearchTerm(searchTerm),
          ...coordinates,
        },
      }
    )
  ).data;

  return stations
    .sort((a, b) =>
      a.title === searchTerm ? -1 : b.title === searchTerm ? 1 : 0
    )
    .map((s) => ({
      title: s.title,
      id: s.eva_ids[0],
      favendoId: s.id,
      raw: global.PROD ? undefined : s,
    }));
}
