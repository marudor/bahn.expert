import { AllowedHafasProfile } from 'types/HAFAS';
import {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from 'types/stationBoard';
import { format } from 'date-fns-tz';
import { StationBoardRequest } from 'types/HAFAS/StationBoard';
import makeRequest from '../Request';
import parse from './parse';

interface Options {
  date?: number;
  direction?: string;
  station: string;
  type: 'ARR' | 'DEP';
}
// @ts-ignore 2384
declare function stationBoard(
  options: Omit<Options, 'type'> & { type: 'ARR' },
  profile?: AllowedHafasProfile
): Promise<ArrivalStationBoardEntry[]>;
// @ts-ignore 2384
declare function stationBoard(
  options: Omit<Options, 'type'> & { type: 'DEP' },
  profile?: AllowedHafasProfile
): Promise<DepartureStationBoardEntry[]>;
function stationBoard(
  { station, date = Date.now(), type, direction }: Options,
  profile?: AllowedHafasProfile
) {
  const req: StationBoardRequest = {
    req: {
      type,
      date: format(date, 'yyyyMMdd', {
        timeZone: 'Europe/Berlin',
      }),
      time: format(date, 'HHmmss', {
        timeZone: 'Europe/Berlin',
      }),
      stbLoc: {
        lid: `A=1@L=${station}`,
      },
      dirLoc: direction
        ? {
            lid: `A=1@L=${direction}`,
          }
        : undefined,
    },
    meth: 'StationBoard',
  };

  return makeRequest(req, parse, profile);
}
export default stationBoard;
