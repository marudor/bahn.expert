import { CommonStop, ParsedCommon } from 'types/HAFAS';
import { Route$Stop } from 'types/routing';
import parseAuslastung from './parseAuslastung';
import parseCommonArrival from './parseCommonArrival';
import parseCommonDeparture from './parseCommonDeparture';

export default (
  stop: CommonStop,
  common: ParsedCommon,
  date: number,
  trainType?: string
): Route$Stop => ({
  station: common.locL[stop.locX],
  arrival: stop.aTimeS
    ? parseCommonArrival(stop, date, common, trainType)
    : undefined,
  departure: stop.dTimeS
    ? parseCommonDeparture(stop, date, common, trainType)
    : undefined,
  auslastung: parseAuslastung(stop.dTrnCmpSX, common.tcocL),
});
