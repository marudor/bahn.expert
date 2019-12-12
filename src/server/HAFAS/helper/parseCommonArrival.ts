import {
  CommonArrival,
  CommonStopInfo,
  ParsedCommon,
  ParsedProduct,
} from 'types/HAFAS';
import { differenceInMinutes } from 'date-fns';
import checkReihung from './checkReihung';
import parseTime from './parseTime';

export default (
  a: CommonArrival,
  date: Date,
  _common: ParsedCommon,
  train?: ParsedProduct
): CommonStopInfo => {
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
    reihung: checkReihung(scheduledTime, a.aTrnCmpSX, train),
    cancelled: a.aCncl,
    // messages: a.msgL ? parseMessages(a.msgL, common) : undefined,
  };
};
