import { AllowedHafasProfile } from 'types/HAFAS';
import { formatToTimeZone } from 'date-fns-timezone';
import { StationBoardRequest } from 'types/HAFAS/StationBoard';
import makeRequest from '../Request';
import parse from './parse';

interface Options {
  date?: number;
  direction?: string;
  station: string;
  type: 'ARR' | 'DEP';
}
function stationBoard(
  { station, date = Date.now(), type, direction }: Options,
  profile?: AllowedHafasProfile
) {
  const req: StationBoardRequest = {
    req: {
      type,
      date: formatToTimeZone(date, 'YYYYMMDD', {
        timeZone: 'Europe/Berlin',
      }),
      time: formatToTimeZone(date, 'HHmmss', {
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
