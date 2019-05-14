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
import parseProduct from '../helper/parseProduct';

const isArrival = (a: CommonArrival | CommonDeparture): a is CommonArrival =>
  a.hasOwnProperty('aOutR');

const parseStationBoardResponse = <type extends 'ARR' | 'DEP'>(
  jny: Jny<type>,
  common: ParsedCommon
): StationBoardEntry => {
  const date = parse(jny.date, 'yyyyMMdd', new Date()).getTime();
  const product = common.prodL[jny.prodX];
  const times = isArrival(jny.stbStop)
    ? {
        arrival: parseCommonArrival(jny.stbStop, date),
      }
    : {
        departure: parseCommonDeparture(jny.stbStop, date),
      };

  return {
    ...parseProduct(product),
    ...times,
    currentStation: common.locL[jny.stbStop.locX],
    finalDestination: jny.dirTxt,
    jid: jny.jid,
    isCancelled: jny.isCncl,
    product: global.PROD ? undefined : product,
  };
};

export default <t extends 'ARR' | 'DEP' = any>(
  r: HafasResponse<StationBoardResponse>,
  parsedCommon: ParsedCommon
): StationBoardEntry<t>[] => {
  // @ts-ignore ???
  const abfahrten: StationBoardEntry<t>[] = r.svcResL[0].res.jnyL.map(
    (j: Jny) => parseStationBoardResponse(j, parsedCommon)
  );

  return abfahrten;
};
