import { CommonArrival, ParsedCommon } from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import { ParsedCommonArrival } from 'types/common';
import parseTime from './parseTime';

export default (
  a: CommonArrival,
  date: number,
  _common: ParsedCommon,
  trainType?: string
): ParsedCommonArrival => {
  const scheduledTime = parseTime(date, a.aTimeS);
  let time = scheduledTime;
  let delay;

  if (a.aTimeR) {
    time = parseTime(date, a.aTimeR);
    delay = time && scheduledTime && differenceInMinutes(time, scheduledTime);
  }

  return {
    scheduledPlatform: a.aPlatfR && a.aPlatfS,
    platform: a.aPlatfR || a.aPlatfS,
    scheduledTime,
    time,
    delay,
    reihung:
      Boolean(a.aTrnCmpSX && a.aTrnCmpSX.tcM) ||
      trainType === 'IC' ||
      trainType === 'EC' ||
      undefined,
    cancelled: a.aCncl,
    // messages: a.msgL ? parseMessages(a.msgL, common) : undefined,
  };
};
