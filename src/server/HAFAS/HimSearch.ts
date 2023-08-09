import { Cache, CacheDatabase } from '@/server/cache';
import { logger } from '@/server/logger';
import { parse } from 'date-fns';
import { Temporal } from '@js-temporal/polyfill';
import makeRequest from '@/server/HAFAS/Request';
import parseTime from '@/server/HAFAS/helper/parseTime';
import type {
  AllowedHafasProfile,
  HafasResponse,
  ParsedCommon,
} from '@/types/HAFAS';
import type {
  HimMessage,
  HimSearchRequest,
  HimSearchResponse,
  ParsedHimMessage,
  ParsedHimSearchResponse,
} from '@/types/HAFAS/HimSearch';

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
): Promise<ParsedHimSearchResponse> => {
  return Promise.resolve({
    messages:
      d.svcResL[0].res?.msgL?.map((m) => parseHimMessage(m, common)) ?? [],
  });
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

const himMessageCache = new Cache<ParsedHimMessage>(CacheDatabase.HIMMessage);

const maxNum = Number.parseInt(process.env.HIM_MAX_FETCH || '5000', 10);

async function fetchTodaysHimMessages() {
  try {
    logger.debug('Fetching HimMessages');
    const messages = await HimSearch({
      onlyToday: true,
      maxNum,
    });

    if (!messages.messages) return;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    for (const message of messages.messages) {
      await himMessageCache.set(message.hid, message);
    }
    logger.debug(`fetched ${messages.messages.length} HIM Messages`);
  } catch {
    logger.error('HIM Messages fetch failed');
  }
}

if (process.env.NODE_ENV !== 'test') {
  void fetchTodaysHimMessages();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setInterval(
    fetchTodaysHimMessages,
    Temporal.Duration.from('PT30M').total('millisecond'),
  );
}

export const getSingleHimMessageOfToday = (
  hid: string,
): Promise<undefined | ParsedHimMessage> => himMessageCache.get(hid);
