import { AllowedHafasProfile } from 'types/HAFAS';
import { format } from 'date-fns-tz';
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
    via,
    time,
    transferTime = -1,
    maxChanges = -1,
    searchForDeparture = true,
    getPasslist = true,
    economic = true,
    ushrp = true,
    getPolyline = false,
    getIV = true,
    numF = 6,
    ctxScr,
    onlyRegional,
    tarif,
  }: TripSearchOptions,
  profile?: AllowedHafasProfile,
  raw?: boolean
) {
  let requestTypeSpecific;

  if (time) {
    requestTypeSpecific = {
      outDate: format(time, 'yyyyMMdd', {
        timeZone: 'Europe/Berlin',
      }),
      outTime: format(time, 'HHmmss', {
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
      viaLocL: via?.length
        ? via.map(evaId => ({
            loc: {
              lid: `A=1@L=${evaId}`,
            },
            min: 10080,
          }))
        : undefined,
      trfReq: tarif
        ? {
            jnyCl: tarif.class,
            cType: 'PK',
            tvlrProf: tarif.traveler.map(t => ({
              type: t.type,
              redtnCard: t.loyalityCard,
            })),
          }
        : undefined,
    },
    meth: 'TripSearch',
    // @ts-ignore
    ...profileConfig[profile],
  };

  return makeRequest(req, raw ? undefined : tripSearchParse, profile);
}

export default route;
