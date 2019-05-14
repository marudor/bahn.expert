import { CommonDeparture } from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import { ParsedCommonDeparture } from 'types/common';
import parseTime from './parseTime';

export default (d: CommonDeparture, date: number): ParsedCommonDeparture => {
  const scheduledTime = parseTime(date, d.dTimeS);
  let time = scheduledTime;
  let delay;

  if (d.dTimeR) {
    time = parseTime(date, d.dTimeR);
    delay = time && scheduledTime && differenceInMinutes(time, scheduledTime);
  }

  return {
    scheduledPlatform: d.dPlatfR && d.dPlatfS,
    platform: d.dPlatfR || d.dPlatfS,
    scheduledTime,
    time,
    delay,
  };
};
