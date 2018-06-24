// @flow
import { orderBy } from 'lodash';
import axios from 'axios';
import Fuse from 'fuse.js';
import iconv from 'iconv-lite';
import rawStations from 'db-stations/data.json';

type OpenDataStation = {
  type: 'station',
  id: string,
  ds100: string,
  nr: number,
  name: string,
  weight: number,
  location: {
    type: 'location',
    latitude: number,
    longitude: number,
  },
  operator: {
    type: 'operator',
    id: string,
    name: string,
  },
  address: {
    city: string,
    zipcode: string,
    street: string,
  },
};

const searchableStations = new Fuse(rawStations, {
  threshold: 0.3,
  minMatchCharLength: 2,
  location: 0,
  distance: 0,
  keys: ['name'],
});

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

export function stationSearchOffline(searchTerm: string): { title: string, id: string }[] {
  const matches: OpenDataStation[] = searchableStations.search(searchTerm);

  return orderBy(matches, 'weight', ['desc']).map(match => ({
    title: match.name,
    id: match.id,
  }));
}

export async function stationSearchHAFAS(searchTerm: string) {
  const buffer = (await axios.get(
    `http://reiseauskunft.bahn.de/bin/ajax-getstop.exe/dn?S=${encodeSearchTerm(searchTerm)}*`,
    {
      responseType: 'arraybuffer',
    }
  )).data;
  const rawReply = iconv.decode(buffer, 'latin-1');
  const stringReply = rawReply.substring(8, rawReply.length - 22);
  const stations = JSON.parse(stringReply).suggestions;

  return stations.map(station => ({
    title: station.value,
    id: Number.parseInt(station.extId, 10).toString(),
  }));
}

export async function stationSearch(searchTerm: string) {
  const stations = (await axios.get(
    `https://si.favendo.de/station-info/rest/api/search?searchTerm=${encodeSearchTerm(searchTerm)}`
  )).data;

  return stations.map(station => ({
    title: station.title,
    id: station.id,
  }));
}
