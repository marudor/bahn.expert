import { format } from 'date-fns';
import axios from 'axios';
import iconv from 'iconv-lite';

interface Train {
  value: string;
  cycle: number;
  pool: number;
  id: number;
  dep: string;
  trainLink: string;
  journParam: string;
  pubTime: string;
  depDate: string;
  depTime: string;
  arr: string;
  arrTime: string;
  vt: string;
  jid: string;
}

export default async (trainName: string, date: number) => {
  const buffer = (await axios.get(
    'https://reiseauskunft.bahn.de/bin/trainsearch.exe/dn',
    {
      params: {
        L: 'vs_json',
        date: format(date, 'dd.MM.yyyy'),
        trainname: trainName,
      },
      responseType: 'arraybuffer',
    }
  )).data;
  const rawReply = iconv.decode(buffer, 'latin-1');

  const stringReply = rawReply.substring(11, rawReply.length - 1);

  const trains: Train[] = JSON.parse(stringReply).suggestions;

  trains.forEach(t => {
    t.jid = `1|${t.id}|0|80|${format(date, 'ddMMyyyy')}`;
  });

  return trains;
};
