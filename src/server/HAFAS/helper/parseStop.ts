import { CommonStop, ParsedCommon } from 'types/HAFAS';
import { Route$Stop } from 'types/routing';
import parseAuslastung from './parseAuslastung';
import parseCommonArrival from './parseCommonArrival';
import parseCommonDeparture from './parseCommonDeparture';
import parseMessages from './parseMessages';

export default (
  stop: CommonStop,
  common: ParsedCommon,
  date: number,
  trainType?: string
): Route$Stop => {
  const arrival = stop.aTimeS
    ? parseCommonArrival(stop, date, common, trainType)
    : undefined;
  const departure = stop.dTimeS
    ? parseCommonDeparture(stop, date, common, trainType)
    : undefined;

  return {
    station: common.locL[stop.locX],
    arrival,
    departure,
    auslastung: parseAuslastung(stop.dTrnCmpSX, common.tcocL),
    additional: stop.isAdd,
    cancelled: (!arrival || stop.aCncl) && (!departure || stop.dCncl),
    messages: parseMessages(stop.msgL, common),
  };
};
