import {
  CommonArrival,
  CommonDeparture,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import { Jny, StationBoardResponse } from 'types/HAFAS/StationBoard';
import { parse } from 'date-fns';
import { StationBoardEntry } from 'types/stationBoard';
import parseCommonArrival from '../helper/parseCommonArrival';
import parseCommonDeparture from '../helper/parseCommonDeparture';
import parseStop from '../helper/parseStop';

const isArrival = (a: CommonArrival | CommonDeparture): a is CommonArrival =>
  a.hasOwnProperty('aOutR');

const parseStationBoardResponse = (
  jny: Jny,
  common: ParsedCommon
): StationBoardEntry => {
  const date = parse(jny.date, 'yyyyMMdd', new Date());
  const product = common.prodL[jny.prodX];
  const commonResponse = {
    train: product,
    finalDestination: jny.dirTxt,
    jid: jny.jid,
    cancelled: jny.isCncl,
    currentStation: common.locL[jny.stbStop.locX],
    stops: jny.stopL?.map(s => parseStop(s, common, date, product)),
    raw: global.PROD ? undefined : jny,
  };

  if (isArrival(jny.stbStop)) {
    return {
      ...commonResponse,
      arrival: parseCommonArrival(jny.stbStop, date, common),
    };
  }

  return {
    ...commonResponse,
    departure: parseCommonDeparture(jny.stbStop, date, common),
  };
};

export default (
  r: HafasResponse<StationBoardResponse>,
  parsedCommon: ParsedCommon
): StationBoardEntry[] => {
  // @ts-ignore ???
  const abfahrten: StationBoardEntry[] = r.svcResL[0].res.jnyL.map((j: Jny) =>
    parseStationBoardResponse(j, parsedCommon)
  );

  return abfahrten;
};
