import axios from 'axios';
import type { OpenDataStation, Station } from 'types/station';

// https://developer.deutschebahn.com/store/apis/info?name=StaDa-Station_Data&version=v2&provider=DBOpenData
// istanbul ignore next
const authKey = `Bearer ${process.env.OPENDATA_AUTH_KEY || ''}`;

export default async (rawSearchTerm: string): Promise<Station[]> => {
  let searchTerm = rawSearchTerm;

  if (searchTerm.length === 2) {
    searchTerm = searchTerm[0];
  }

  const url = `https://api.deutschebahn.com/stada/v2/stations?searchstring=*${encodeURIComponent(
    searchTerm.replace(/ /g, '*')
  )}*`;

  try {
    const result = (
      await axios.get<{ result: OpenDataStation[] }>(url, {
        withCredentials: true,
        headers: {
          Authorization: authKey,
        },
      })
    ).data;

    return result.result.map((s) => ({
      title: s.name,
      id: String(s.evaNumbers[0] ? s.evaNumbers[0].number : undefined),
      DS100: s.ril100Identifiers[0]
        ? s.ril100Identifiers[0].rilIdentifier
        : undefined,
      raw: global.PROD ? undefined : s,
    }));
  } catch (e) {
    if (e.response?.status === 404) {
      return [];
    }
    throw e;
  }
};
