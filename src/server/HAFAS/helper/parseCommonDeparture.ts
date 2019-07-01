import { CommonDeparture, ParsedCommon } from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import { ParsedCommonDeparture } from 'types/common';
import checkReihung from './checkReihung';
import parseTime from './parseTime';

export default (
  d: CommonDeparture,
  date: number,
  _common: ParsedCommon,
  trainType?: string
): ParsedCommonDeparture => {
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
    reihung: checkReihung(d.dTrnCmpSX, trainType),
    cancelled: d.dCncl,
    // messages: d.msgL ? parseMessages(d.msgL, common) : undefined,
  };
};
