import { CommonDeparture, ParsedCommonDeparture } from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import parseTime from './parseTime';

export default (d: CommonDeparture, date: number): ParsedCommonDeparture => {
  const scheduledDeparture = parseTime(date, d.dTimeS);
  let departure = scheduledDeparture;
  let departureDelay;

  if (d.dTimeR) {
    departure = parseTime(date, d.dTimeR);
    departureDelay =
      departure &&
      scheduledDeparture &&
      differenceInMinutes(departure, scheduledDeparture);
  }

  return {
    scheduledDeparturePlatform: d.dPlatfR && d.dPlatfS,
    departurePlatform: d.dPlatfR || d.dPlatfS,
    scheduledDeparture,
    departure,
    departureDelay,
  };
};
