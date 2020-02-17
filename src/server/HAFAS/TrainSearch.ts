import { AllowedHafasProfile } from 'types/HAFAS';
import { format, parse, subDays } from 'date-fns';
import { TrainSearchResult } from 'types/HAFAS/Details';
import axios from 'axios';
import createCtxRecon from 'server/HAFAS/helper/createCtxRecon';
import iconv from 'iconv-lite';
import journeyDetails from './JourneyDetails';

const profiles = {
  DB: {
    url: 'https://reiseauskunft.bahn.de/bin/trainsearch.exe/dn',
    number: 80,
  },
  OEBB: {
    url: 'https://fahrplan.oebb.at/bin/trainsearch.exe/dn',
    number: 81,
  },
};

export default async (
  trainName: string,
  initialDepartureDate?: number,
  profileType: AllowedHafasProfile = AllowedHafasProfile.DB
) => {
  const profile: undefined | typeof profiles['DB'] = (profiles as any)[
    profileType
  ];

  if (!profile) {
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
  const buffer = (
    await axios.get(profile.url, {
      params: {
        L: 'vs_json',
        date: format(date, 'dd.MM.yyyy'),
        trainname: trainName,
        // Nur Züge die in DE halten
        stationFilter: profile.number,
        // evtl benutzen
        // 1: ICE
        // 2: IC/EC
        // 4: RE
        // 8: RB
        // 16: S
        productClassFilter: 31,
      },
      responseType: 'arraybuffer',
    })
  ).data;
  const rawReply = iconv.decode(buffer, 'latin-1').trim();

  const stringReply = rawReply.substring(11, rawReply.length - 1);

  let parsed;

  try {
    parsed = JSON.parse(stringReply);
  } catch (e) {
    parsed = {};
  }
  const trains: TrainSearchResult[] = parsed.suggestions;

  if (!trains || !trains.length) return undefined;
  const firstResult = trains[0];

  firstResult.jid = `1|${firstResult.id}|${firstResult.cycle}|${
    profile.number
  }|${format(
    parse(firstResult.depDate, 'dd.MM.yyyy', Date.now()),
    'ddMMyyyy'
  )}`;
  const jDetails = await journeyDetails(firstResult.jid, profileType);

  if (jDetails.firstStop) {
    firstResult.ctxRecon = createCtxRecon({
      firstStop: jDetails.firstStop,
      lastStop: jDetails.lastStop,
      trainName: firstResult.value,
      messages: jDetails.messages,
    });
  }
  firstResult.jDetails = jDetails;

  return firstResult;
};
