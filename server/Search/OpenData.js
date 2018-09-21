// @flow
import { logger } from '../logger';
import axios from 'axios';
import type { Station } from 'types/abfahrten';

// https://developer.deutschebahn.com/store/apis/info?name=StaDa-Station_Data&version=v2&provider=DBOpenData
const authKey = `Bearer ${process.env.OPENDATA_AUTH_KEY || ''}`;

export default async (rawSearchTerm: string): Promise<Station[]> => {
  let searchTerm = rawSearchTerm;

  if (searchTerm.length === 2) {
    searchTerm = searchTerm[0];
  }
  let result;

  const url = `https://api.deutschebahn.com/stada/v2/stations?searchstring=*${encodeURIComponent(searchTerm)}*`;

  try {
    result = (await axios.get(url, {
      withCredentials: true,
      headers: {
        Authorization: authKey,
      },
    })).data;
  } catch (e) {
    logger.warn(`OpenData failed`, {
      url,
      searchTerm,
      error: e,
    });

    return [];
  }

  return result.result.map(s => ({
    title: s.name,
    favendoId: s.number,
    id: s.evaNumbers[0]?.number,
    DS100: s.ril100Identifiers[0]?.rilIdentifier,
  }));
};
