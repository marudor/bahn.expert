// @flow
import axios from 'axios';
import iconv from 'iconv-lite';
import OpenDataSearch from './OpenData';
import DBNavigatorSearch from './DBNavigator';
import OpenDBSearch from './OpenDB';

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

// https://si.favendo.de/station-info/rest/api/search?searchTerm=Bochum
export async function stationSearch(searchTerm: string) {
  const stations = (await axios.get(
    `https://si.favendo.de/station-info/rest/api/search?searchTerm=${encodeSearchTerm(searchTerm)}`
  )).data;

  return stations.map(station => ({
    title: station.title,
    id: station.eva_ids[0],
  }));
}

export default (searchTerm: string, type: ?string) => {
  switch (type) {
    case 'dbNav':
      return DBNavigatorSearch(searchTerm);
    case 'openData':
      return OpenDataSearch(searchTerm);
    case 'openDB':
      return OpenDBSearch(searchTerm);
    case 'hafas':
      return stationSearchHAFAS(searchTerm);
    case 'favendo':
    default:
      return stationSearch(searchTerm);
  }
};
