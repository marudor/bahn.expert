import { AllowedHafasProfile } from 'types/HAFAS';
import { format, parse, subDays } from 'date-fns';
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
  initialDepartureDate?: number,
  profileType: AllowedHafasProfile = AllowedHafasProfile.db
) => {
  if (
    profileType !== AllowedHafasProfile.db &&
    profileType !== AllowedHafasProfile.oebb
  ) {
    throw new Error(`${profileType} not supported by trainsearch`);
  }
  let date = initialDepartureDate;

  if (!date) {
    const now = new Date();

    if (now.getHours() < 3) {
      date = subDays(now, 1).getTime();
    } else {
      date = now.getTime();
    }
  }
  const profile = profiles[profileType];
  const buffer = (await axios.get(profile.url, {
    params: {
      L: 'vs_json',
      date: format(date, 'dd.MM.yyyy'),
      trainname: trainName,
      // Nur Züge die in DE halten
      stationFilter: 80,
      // evtl benutzen
      // 1: ICE
      // 2: IC/EC
      // 4: RE
      // 8: RB
      // 16: S
      productClassFilter: 31,
    },
    responseType: 'arraybuffer',
  })).data;
  const rawReply = iconv.decode(buffer, 'latin-1').trim();

  const stringReply = rawReply.substring(11, rawReply.length - 1);

  let parsed;

  try {
    parsed = JSON.parse(stringReply);
  } catch (e) {
    parsed = {};
  }
  const trains: Train[] = parsed.suggestions;

  if (!trains || !trains.length) return undefined;
  const firstResult = trains[0];

  firstResult.jid = `1|${firstResult.id}|${firstResult.cycle}|${
    profile.number
  }|${format(parse(firstResult.depDate, 'dd.MM.yyyy', 0), 'ddMMyyyy')}`;
  const jDetails = await journeyDetails(firstResult.jid, profileType);

  // highly unknown what this exactly does
  // some replacement trains need a 2 here.
  let replacementNumber = 1;

  if (
    jDetails.messages &&
    jDetails.messages.some(m => m.txtN.includes('Ersatzfahrt'))
  ) {
    replacementNumber = 2;
  }

  firstResult.ctxRecon = `¶HKI¶T$A=1@L=${
    jDetails.firstStop.station.id
  }@a=128@$A=1@L=${jDetails.lastStop.station.id}@a=128@$${format(
    jDetails.firstStop.departure.scheduledTime,
    'yyyyMMddHHmm'
  )}$${format(jDetails.lastStop.arrival.scheduledTime, 'yyyyMMddHHmm')}$${
    firstResult.value
  }$$${replacementNumber}$`;
  firstResult.jDetails = jDetails;

  return firstResult;
};
