import { AllowedHafasProfile } from 'types/HAFAS';
import { formatToTimeZone } from 'date-fns-timezone';
import { TripSearchOptions, TripSearchRequest } from 'types/HAFAS/TripSearch';
import makeRequest from '../Request';
import tripSearchParse from './parse';

const profileConfig = {
  db: {
    cfg: {
      rtMode: 'HYBRID',
    },
  },
};

function route(
  {
    start,
    destination,
    time,
    transferTime = -1,
    maxChanges = -1,
    searchForDeparture = true,
    // get stops in between
    getPasslist = true,
    // true = not only fastest
    economic = true,
    getTariff = false,
    // Umgebung reicht als stationen?
    ushrp = true,
    // unknown data
    getPolyline = false,
    // unknown flag
    getIV = true,
    // Number of results to fetch
    numF = 6,
    ctxScr,
    onlyRegional,
  }: TripSearchOptions,
  profile?: AllowedHafasProfile
) {
  let requestTypeSpecific;

  if (time) {
    requestTypeSpecific = {
      outDate: formatToTimeZone(time, 'YYYYMMDD', {
        timeZone: 'Europe/Berlin',
      }),
      outTime: formatToTimeZone(time, 'HHmmss', {
        timeZone: 'Europe/Berlin',
      }),
    };
  } else if (ctxScr) {
    requestTypeSpecific = {
      ctxScr,
    };
  } else {
    throw new Error('Either Time or Context required');
  }

  const req: TripSearchRequest = {
    req: {
      jnyFltrL: onlyRegional
        ? [
            {
              value: '1016',
              mode: 'INC',
              type: 'PROD',
            },
          ]
        : undefined,
      // Always true!
      getPT: true,
      numF,
      ...requestTypeSpecific,
      maxChg: maxChanges,
      minChgTime: transferTime,
      getPasslist,
      economic,
      getTariff,
      ushrp,
      getPolyline,
      getIV,
      // arrival / departure
      outFrwd: searchForDeparture,
      arrLocL: [
        {
          lid: `A=1@L=${destination}`,
        },
      ],
      depLocL: [
        {
          lid: `A=1@L=${start}`,
        },
      ],
    },
    meth: 'TripSearch',
    // @ts-ignore
    ...profileConfig[profile],
  };

  return makeRequest(req, tripSearchParse, profile);
}

export default route;
