import { formatToTimeZone } from 'date-fns-timezone';
import { HafasResponse } from 'types/HAFAS';
import { TripSearchRequest, TripSearchResponse } from 'types/HAFAS/TripSearch';
import makeRequest from '../Request';
import tripSearchParse from './parse';

export type Options = {
  start: string;
  destination: string;
  time: number;
  transferTime?: number;
  maxChanges?: number;
  getPasslist?: boolean;
  searchForDeparture?: boolean;
  economic?: boolean;
  getTariff?: boolean;
};

// @ts-ignore ???
declare function route(o: Options): Promise<ReturnType<typeof tripSearchParse>>;
// @ts-ignore ???
declare function route(
  o: Options,
  noParse: true
): Promise<HafasResponse<TripSearchResponse>>;
function route(
  {
    start,
    destination,
    time,
    transferTime = -1,
    maxChanges = -1,
    searchForDeparture = true,
    getPasslist = true,
    economic = false,
    // Verspätung
    getTariff = true,
  }: Options,
  noParse?: true
) {
  const req: TripSearchRequest = {
    req: {
      // jnyFltrL: [
      //   {
      //     // value: '1023',
      //     // mode: 'INC',
      //     type: 'PROD',
      //   },
      // ],
      // Always true!
      getPT: true,
      numF: 6,
      outDate: formatToTimeZone(time, 'YYYYMMDD', {
        timeZone: 'Europe/Berlin',
      }),
      outTime: formatToTimeZone(time, 'HHmmss', {
        timeZone: 'Europe/Berlin',
      }),
      maxChg: maxChanges,
      minChgTime: transferTime,
      // get stops in between
      getPasslist,
      economic,
      getTariff,
      ushrp: true,
      // unknown data
      getPolyline: false,
      getIV: true,
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
    cfg: {
      rtMode: 'HYBRID',
    },
  };

  return makeRequest(req, noParse ? undefined : tripSearchParse);
}

export default route;
