import { CacheDatabases, createNewCache } from 'server/cache';
import { logger } from 'server/logger';
import { parse } from 'date-fns';
import makeRequest from 'server/HAFAS/Request';
import parseTime from 'server/HAFAS/helper/parseTime';
import type {
  AllowedHafasProfile,
  HafasResponse,
  ParsedCommon,
} from 'types/HAFAS';
import type {
  HimMessage,
  HimSearchRequest,
  HimSearchResponse,
  ParsedHimMessage,
  ParsedHimSearchResponse,
} from 'types/HAFAS/HimSearch';

const parseHimMessage = (himMessage: HimMessage, common: ParsedCommon) => {
  return {
    ...himMessage,
    affectedProducts:
      himMessage.affProdRefL?.map((prodRef) => common.prodL[prodRef]) ?? [],
    startTime: parseTime(
      parse(himMessage.sDate, 'yyyyMMdd', Date.now()),
      himMessage.sTime,
    ),
    endTime: parseTime(
      parse(himMessage.eDate, 'yyyyMMdd', Date.now()),
      himMessage.eTime,
    ),
    fromStopPlace: common.locL[himMessage.fLocX],
    toStopPlace: common.locL[himMessage.tLocX],
  };
};
const parseHimSearch = (
  d: HafasResponse<HimSearchResponse>,
  common: ParsedCommon,
): ParsedHimSearchResponse => {
  return {
    messages:
      d.svcResL[0].res?.msgL?.map((m) => parseHimMessage(m, common)) ?? [],
  };
};

const HimSearch = (
  request: HimSearchRequest['req'],
  profile?: AllowedHafasProfile,
  raw?: boolean,
): Promise<ParsedHimSearchResponse> => {
  const req: HimSearchRequest = {
    req: request,
    meth: 'HimSearch',
  };

  return makeRequest(req, raw ? undefined : parseHimSearch, profile);
};

export default HimSearch;

// 24 hours in seconds
const himMessageCache = createNewCache<string, ParsedHimMessage>(
  24 * 60 * 60,
  CacheDatabases.HIMMessage,
);

const maxNum =
  Number.parseInt(process.env.HIM_MAX_FETCH || '5000', 10) || 50000;

async function fetchTodaysHimMessages() {
  try {
    logger.debug('Fetching HimMessages');
    const messages = await HimSearch({
      onlyToday: true,
      maxNum,
    });

    if (!messages.messages) return;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    messages.messages.forEach((message) => {
      void himMessageCache.set(message.hid, message);
    });
    logger.debug('Fetched HimMessages');
  } catch (e: any) {
    logger.error(e, 'HimMessages fetch failed');
  }
}

if (process.env.NODE_ENV !== 'test') {
  void fetchTodaysHimMessages();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(fetchTodaysHimMessages, 2 * 60 * 1000);
}

export const getSingleHimMessageOfToday = (
  hid: string,
): Promise<undefined | ParsedHimMessage> => himMessageCache.get(hid);
