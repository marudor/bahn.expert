// @flow
import axios from 'axios';
import type { Station } from 'types/abfahrten';

// https://developer.deutschebahn.com/store/apis/info?name=StaDa-Station_Data&version=v2&provider=DBOpenData
// istanbul ignore next
const authKey = `Bearer ${process.env.OPENDATA_AUTH_KEY || ''}`;

export default async (rawSearchTerm: string): Promise<Station[]> => {
  let searchTerm = rawSearchTerm;

  if (searchTerm.length === 2) {
    searchTerm = searchTerm[0];
  }

  const url = `https://api.deutschebahn.com/stada/v2/stations?searchstring=*${encodeURIComponent(searchTerm)}*`;

  const result = (await axios.get(url, {
    withCredentials: true,
    headers: {
      Authorization: authKey,
    },
  })).data;

  return result.result.map(s => ({
    title: s.name,
    favendoId: s.number,
    id: String(s.evaNumbers[0]?.number),
    DS100: s.ril100Identifiers[0]?.rilIdentifier,
  }));
};
