// @flow
import { formatToTimeZone } from 'date-fns-timezone';
import axios from 'axios';
import createChecksum from 'server/dbNavUtil';
import parse from './parse';
import type { Options } from '.';

const BASE_URL = 'https://reiseauskunft.bahn.de/bin/mgate.exe';

function createRequest({
  start,
  destination,
  time,
  transferTime = -1,
  maxChanges = -1,
  searchForDeparture = true,
}: Options) {
  const data = {
    client: {
      id: 'DB',
      v: '18120000',
      type: 'IPH',
      name: 'DB Navigator',
    },
    ext: 'DB.R18.06.a',
    lang: 'de',
    ver: '1.20',
    svcReqL: [
      {
        req: {
          jnyFltrL: [
            {
              value: '1023',
              mode: 'INC',
              type: 'PROD',
            },
          ],
          outDate: formatToTimeZone(time, 'YYYYMMDD', { timeZone: 'Europe/Berlin' }),
          outTime: formatToTimeZone(time, 'HHmmss', { timeZone: 'Europe/Berlin' }),
          maxChg: maxChanges,
          minChgTime: transferTime,
          // get stops in between
          getPasslist: true,
          economic: true,
          getTariff: true,
          ushrp: false,
          getPolyline: false,
          // arrival / departure
          outFrwd: searchForDeparture,
          getPT: true,
          getIV: true,
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
      },
    ],
    auth: {
      aid: 'n91dB8Z77MLdoR0K',
      type: 'AID',
    },
  };

  return {
    data,
    checksum: createChecksum(data),
  };
}
export default function routeDBNav(options: Options) {
  const { data, checksum } = createRequest(options);

  return axios
    .post(BASE_URL, data, {
      params: {
        checksum,
      },
    })
    .then(r => r.data)
    .then(r => {
      if (r.err === 'OK') {
        return parse(r);
      }
      throw r;
    });
  // .then(r => r.svcResL[0].res);
}
