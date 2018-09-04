// @flow
import axios from 'axios';

const authKey = process.env.OPENDB_AUTH_KEY || '';

// https://open-api.bahn.de/bin/rest.exe/location.name?format=json&input=Hamburg&products=1&authKey=
export default async (searchTerm: string): Promise<{ title: string, id: string }[]> => {
  if (searchTerm.length === 2) {
    searchTerm = searchTerm[0];
  }
  const result = (await axios.get(
    `https://open-api.bahn.de/bin/rest.exe/location.name?format=json&input=${searchTerm}&products=1&authKey=${authKey}`
  )).data;
  if (!Array.isArray(result.LocationList.StopLocation)) {
    result.LocationList.StopLocation = [result.LocationList.StopLocation];
  }
  return result.LocationList.StopLocation.map(s => ({
    title: s.name,
    id: Number.parseInt(s.id, 10).toString(),
  }));
};
