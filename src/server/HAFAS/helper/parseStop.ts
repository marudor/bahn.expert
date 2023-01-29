import parseAuslastung from './parseAuslastung';
import parseCommonArrival from './parseCommonArrival';
import parseCommonDeparture from './parseCommonDeparture';
import parseMessages from './parseMessages';
import type { CommonStop, ParsedCommon, ParsedProduct } from '@/types/HAFAS';
import type { Route$Stop } from '@/types/routing';

export default (
  stop: CommonStop,
  common: ParsedCommon,
  date: Date,
  train: ParsedProduct,
): Route$Stop => {
  const arrival = stop.aTimeS
    ? parseCommonArrival(stop, date, common, train)
    : undefined;
  const departure = stop.dTimeS
    ? parseCommonDeparture(stop, date, common, train)
    : undefined;

  return {
    station: common.locL[stop.locX],
    arrival,
    departure,
    auslastung: parseAuslastung(stop.dTrnCmpSX, common.tcocL),
    additional: stop.isAdd,
    cancelled:
      (arrival || departure) &&
      (!arrival || stop.aCncl) &&
      (!departure || stop.dCncl),
    messages: parseMessages(stop.msgL, common),
  };
};
