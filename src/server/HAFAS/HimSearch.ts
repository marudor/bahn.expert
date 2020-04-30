import { AllowedHafasProfile, HafasResponse, ParsedCommon } from 'types/HAFAS';
import { CacheDatabases, createNewCache } from 'server/cache';
import {
  HimMessage,
  HimSearchRequest,
  HimSearchResponse,
  ParsedHimMessage,
  ParsedHimSearchResponse,
} from 'types/HAFAS/HimSearch';
import { logger } from 'server/logger';
import { parse } from 'date-fns';
import makeRequest from 'server/HAFAS/Request';
import parseTime from 'server/HAFAS/helper/parseTime';

const parseHimMessage = (himMessage: HimMessage, common: ParsedCommon) => {
  return {
    ...himMessage,
    affectedProducts:
      himMessage.affProdRefL?.map((prodRef) => common.prodL[prodRef]) ?? [],
    startTime: parseTime(
      parse(himMessage.sDate, 'yyyyMMdd', Date.now()),
      himMessage.sTime
    ),
    endTime: parseTime(
      parse(himMessage.eDate, 'yyyyMMdd', Date.now()),
      himMessage.eTime
    ),
  };
};
const parseHimSearch = (
  d: HafasResponse<HimSearchResponse>,
  common: ParsedCommon
): ParsedHimSearchResponse => {
  return {
    messages:
      d.svcResL[0].res?.msgL?.map((m) => parseHimMessage(m, common)) ?? [],
  };
};

const HimSearch = (
  request: HimSearchRequest['req'],
  profile?: AllowedHafasProfile,
  raw?: boolean
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
  CacheDatabases.HIMMessage
);

const maxNum =
  Number.parseInt(process.env.HIM_MAX_FETCH || '50000', 10) || 50000;

async function fetchTodaysHimMessages() {
  try {
    logger.debug('Fetching HimMessages');
    const messages = await HimSearch({
      onlyToday: true,
      maxNum,
    });

    if (!messages.messages) return;

    messages.messages.forEach((message) => {
      himMessageCache.set(message.hid, message);
    });
    logger.debug('Fetched HimMessages');
  } catch (e) {
    logger.error(e, 'HimMessages fetch failed');
  }
}

if (process.env.NODE_ENV !== 'test') {
  fetchTodaysHimMessages();
  setInterval(fetchTodaysHimMessages, 2 * 60 * 1000);
}

export const getSingleHimMessageOfToday = (
  hid: string
): Promise<undefined | ParsedHimMessage> => himMessageCache.get(hid);
