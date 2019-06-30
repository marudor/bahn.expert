import { AllowedHafasProfile } from 'types/HAFAS';
import { format, parse } from 'date-fns';
import { ParsedJourneyDetails } from 'types/HAFAS/JourneyDetails';
import axios from 'axios';
import iconv from 'iconv-lite';
import journeyDetails from './JourneyDetails';

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
  ctxRecon: string;
  jDetails: ParsedJourneyDetails;
}

const profiles = {
  db: {
    url: 'https://reiseauskunft.bahn.de/bin/trainsearch.exe/dn',
    number: 80,
  },
  oebb: {
    url: 'https://fahrplan.oebb.at/bin/trainsearch.exe/dn',
    number: 81,
  },
};

export default async (
  trainName: string,
  date: number,
  profileType: AllowedHafasProfile = 'db'
) => {
  const profile = profiles[profileType];
  const buffer = (await axios.get(profile.url, {
    params: {
      L: 'vs_json',
      use_realtime_filter: 1,
      date: format(date, 'dd.MM.yyyy'),
      trainname: trainName,
      // Nur Züge die in DE halten
      stationFilter: 80,
      // evtl benutzen
      // 1: ICE
      // 2: IC/EC
      // 8: RE/RB
      // 16: S
      productClassFilter: 31,
    },
    responseType: 'arraybuffer',
  })).data;
  const rawReply = iconv.decode(buffer, 'latin-1').trim();

  const stringReply = rawReply.substring(11, rawReply.length - 1);

  const trains: Train[] = JSON.parse(stringReply).suggestions;

  await Promise.all(
    trains.map(async t => {
      t.jid = `1|${t.id}|${t.cycle}|${profile.number}|${format(
        parse(t.depDate, 'dd.MM.yyyy', 0),
        'ddMMyyyy'
      )}`;
      const jDetails = await journeyDetails(t.jid, profileType);

      t.ctxRecon = `¶HKI¶T$A=1@L=${
        jDetails.firstStop.station.id
      }@a=128@$A=1@L=${jDetails.lastStop.station.id}@a=128@$${format(
        jDetails.firstStop.departure.scheduledTime,
        'yyyyMMddHHmm'
      )}$${format(jDetails.lastStop.arrival.scheduledTime, 'yyyyMMddHHmm')}$${
        t.value
      }$$1$`;
      t.jDetails = jDetails;
    })
  );

  return trains;
};
