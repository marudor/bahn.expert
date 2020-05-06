import axios from 'axios';
import type { OpenDBStation, Station } from 'types/station';

interface OpenDBResult {
  LocationList: {
    StopLocation: OpenDBStation | OpenDBStation[];
  };
}

// istanbul ignore next
const authKey = process.env.OPENDB_AUTH_KEY || '';

// https://open-api.bahn.de/bin/rest.exe/location.name?format=json&input=Hamburg&products=1&authKey=
export default async (rawSearchTerm: string): Promise<Station[]> => {
  let searchTerm = rawSearchTerm;

  if (searchTerm.length === 2) {
    searchTerm = searchTerm[0];
  }
  const result = (
    await axios.get<OpenDBResult>(
      `https://open-api.bahn.de/bin/rest.exe/location.name?format=json&input=${searchTerm}&products=1&authKey=${authKey}`
    )
  ).data;

  if (!Array.isArray(result.LocationList.StopLocation)) {
    result.LocationList.StopLocation = [result.LocationList.StopLocation];
  }
  const stations = result.LocationList.StopLocation.filter(
    (s) =>
      s.name !== s.name.toUpperCase() &&
      s.name.substr(0, 3) !== s.name.substr(0, 3).toUpperCase()
  );

  return stations.map((s) => ({
    title: s.name,
    id: Number.parseInt(s.id, 10).toString(),
    raw: global.PROD ? undefined : s,
  }));
};
