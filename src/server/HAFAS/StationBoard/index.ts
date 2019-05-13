import { formatToTimeZone } from 'date-fns-timezone';
import { StationBoardRequest } from 'types/HAFAS/StationBoard';
import makeRequest from '../Request';

interface Options {
  date?: number;
  station: string;
}
function stationBoard({ station, date = Date.now() }: Options) {
  const req: StationBoardRequest = {
    req: {
      type: 'DEP',
      date: formatToTimeZone(date, 'YYYYMMDD', {
        timeZone: 'Europe/Berlin',
      }),
      time: formatToTimeZone(date, 'HHmmss', {
        timeZone: 'Europe/Berlin',
      }),
      stbLoc: {
        lid: `A=1@L=${station}`,
      },
    },
    meth: 'StationBoard',
  };

  return makeRequest(req);
}

export default stationBoard;
