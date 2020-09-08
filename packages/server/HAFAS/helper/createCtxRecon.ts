import { format } from 'date-fns';
import type { RemL } from 'types/HAFAS';
import type {
  Route$ValidArrivalStop,
  Route$ValidDepartureStop,
} from 'types/HAFAS/JourneyDetails';

interface CreateCtxReconOptions {
  firstStop: Route$ValidDepartureStop;
  lastStop: Route$ValidArrivalStop;
  trainName: string;
  messages?: RemL[];
}
export default ({
  firstStop,
  lastStop,
  trainName,
  messages,
}: CreateCtxReconOptions): string => {
  // highly unknown what this exactly does
  // some replacement trains need a 2 here.
  let replacementNumber = 1;

  if (messages?.some((m) => m.txtN.includes('Ersatzfahrt'))) {
    replacementNumber = 2;
  }

  return `¶HKI¶T$A=1@L=${firstStop.station.id}@a=128@$A=1@L=${
    lastStop.station.id
  }@a=128@$${format(
    firstStop.departure.scheduledTime,
    'yyyyMMddHHmm',
  )}$${format(
    lastStop.arrival.scheduledTime,
    'yyyyMMddHHmm',
  )}$${trainName}$$${replacementNumber}$`;
};
