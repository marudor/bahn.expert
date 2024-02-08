import { format } from 'date-fns-tz';
import makeRequest from '../Request';
import mapLoyalityCard from '@/server/HAFAS/TripSearch/mapLoyalityCard';
import NetzcardBetreiber from './NetzcardBetreiber.json';
import tripSearchParse from './parse';
import type {
  AllowedHafasProfile,
  JourneyFilter,
  OptionalLocL,
} from '@/types/HAFAS';
import type { Coordinate2D } from '@/external/types';
import type { RoutingResult } from '@/types/routing';
import type {
  TripSearchOptionsV3,
  TripSearchRequest,
} from '@/types/HAFAS/TripSearch';

const netzcardFilter: JourneyFilter[] = NetzcardBetreiber.map((betreiber) => ({
  mode: 'INC',
  type: 'OP',
  value: betreiber,
}));

const onlyRegionalFilter: JourneyFilter[] = [
  {
    value: '1016',
    mode: 'INC',
    type: 'PROD',
  },
];

const profileConfig = {
  db: {
    cfg: {
      rtMode: 'HYBRID',
    },
  },
};

function convertSingleCoordinate(singleCoordinate: number): number {
  const splittedCoordinate = singleCoordinate.toString().split('.');
  const pre = splittedCoordinate[0].padStart(2, '0');
  const post = (splittedCoordinate[1] || '').padEnd(6, '0').slice(0, 6);

  return Number.parseInt(`${pre}${post}`);
}

function startDestinationMap(startDest: string | Coordinate2D): OptionalLocL {
  if (typeof startDest === 'string') {
    return {
      lid: `A=1@L=${startDest}@B=1`,
    };
  }

  return {
    crd: {
      x: convertSingleCoordinate(startDest.longitude),
      y: convertSingleCoordinate(startDest.latitude),
    },
  };
}

export function tripSearch(
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
    ushrp = false,
    getPolyline = false,
    getIV = true,
    numF = 6,
    ctxScr,
    onlyRegional,
    onlyNetzcard,
    tarif,
  }: TripSearchOptionsV3,
  profile?: AllowedHafasProfile,
  raw?: boolean,
): Promise<RoutingResult> {
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

  const journeyFilter: JourneyFilter[] = [];
  if (onlyRegional) {
    journeyFilter.push(...onlyRegionalFilter);
  }
  if (onlyNetzcard) {
    journeyFilter.push(...netzcardFilter);
  }
  const arrLoc = startDestinationMap(destination);
  const depLoc = startDestinationMap(start);

  const req: TripSearchRequest = {
    req: {
      jnyFltrL: journeyFilter.length ? journeyFilter : undefined,
      // getPT: true,
      numF,
      ...requestTypeSpecific,
      maxChg: maxChanges === -1 ? undefined : maxChanges,
      minChgTime: transferTime || undefined,
      getPasslist,
      economic,
      ushrp,
      getPolyline,
      getIV,
      // arrival / departure
      outFrwd: searchForDeparture ? undefined : false,
      arrLocL: [arrLoc],
      depLocL: [depLoc],
      viaLocL: via?.length
        ? via.map(({ evaId, minChangeTime }) => ({
            loc: {
              lid: `A=1@L=${evaId}`,
            },
            min: minChangeTime,
          }))
        : undefined,
      trfReq: tarif
        ? {
            jnyCl: tarif.class,
            cType: 'PK',
            tvlrProf: tarif.traveler.map((t) => ({
              type: t.type,
              redtnCard: mapLoyalityCard(t.loyalityCard, profile),
            })),
          }
        : undefined,
    },
    meth: 'TripSearch',
    // @ts-expect-error spread works
    ...profileConfig[profile ?? 'db'],
  };

  return makeRequest(req, raw ? undefined : tripSearchParse, profile);
}
