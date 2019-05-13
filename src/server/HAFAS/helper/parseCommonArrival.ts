import { CommonArrival, ParsedCommonArrival } from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import parseTime from './parseTime';

export default (a: CommonArrival, date: number): ParsedCommonArrival => {
  const scheduledArrival = parseTime(date, a.aTimeS);
  let arrival = scheduledArrival;
  let arrivalDelay;

  if (a.aTimeR) {
    arrival = parseTime(date, a.aTimeR);
    arrivalDelay =
      arrival &&
      scheduledArrival &&
      differenceInMinutes(arrival, scheduledArrival);
  }

  return {
    scheduledArrivalPlatform: a.aPlatfR && a.aPlatfS,
    arrivalPlatform: a.aPlatfR || a.aPlatfS,
    scheduledArrival,
    arrival,
    arrivalDelay,
  };
};
