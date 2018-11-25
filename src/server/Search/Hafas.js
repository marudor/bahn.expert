// @flow
import axios from 'axios';
import iconv from 'iconv-lite';
import type { Station } from 'types/abfahrten';

export default async function(searchTerm: string): Promise<Station[]> {
  const buffer = (await axios.get(`http://reiseauskunft.bahn.de/bin/ajax-getstop.exe/dn?S=${searchTerm}*`, {
    responseType: 'arraybuffer',
  })).data;

  const rawReply = iconv.decode(buffer, 'latin-1');

  const stringReply = rawReply.substring(8, rawReply.length - 22);

  const stations = JSON.parse(stringReply).suggestions;

  return stations
    .filter(s => s.value !== s.value.toUpperCase())
    .map(s => ({
      title: s.value,
      id: Number.parseInt(s.extId, 10).toString(),
    }));
}
