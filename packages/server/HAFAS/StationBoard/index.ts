import { format } from 'date-fns-tz';
import makeRequest from '../Request';
import parse from './parse';
import type { AllowedHafasProfile, JourneyFilter } from 'types/HAFAS';
import type {
  ArrivalStationBoardEntry,
  DepartureStationBoardEntry,
} from 'types/stationBoard';
import type { StationBoardRequest } from 'types/HAFAS/StationBoard';

interface Options {
  date?: number;
  direction?: string;
  station: string;
  type: 'ARR' | 'DEP';
  filter?: JourneyFilter[];
}
function stationBoard(
  options: Omit<Options, 'type'> & { type: 'ARR' },
  profile?: AllowedHafasProfile,
  raw?: boolean
): Promise<ArrivalStationBoardEntry[]>;
function stationBoard(
  options: Omit<Options, 'type'> & { type: 'DEP' },
  profile?: AllowedHafasProfile,
  raw?: boolean
): Promise<DepartureStationBoardEntry[]>;
function stationBoard(
  { station, date = Date.now(), type, direction, filter }: Options,
  profile?: AllowedHafasProfile,
  raw?: boolean
) {
  const req: StationBoardRequest = {
    req: {
      type,
      getPasslist: true,
      maxJny: 250,
      jnyFltrL: filter,
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

  return makeRequest(req, raw ? undefined : parse, profile);
}
export default stationBoard;
