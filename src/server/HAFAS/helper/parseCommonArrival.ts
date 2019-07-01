import { CommonArrival, ParsedCommon } from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import { ParsedCommonArrival } from 'types/common';
import checkReihung from './checkReihung';
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
    reihung: checkReihung(a.aTrnCmpSX, trainType),
    cancelled: a.aCncl,
    // messages: a.msgL ? parseMessages(a.msgL, common) : undefined,
  };
};
