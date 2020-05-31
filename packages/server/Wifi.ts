import { logger } from 'server/logger';
import request from 'umi-request';
import type { AP, WifiData } from 'types/Wifi';

interface APWithTrain extends AP {
  trainTimestamp: number;
  trainBR: string;
}

type TransformedWifiData = Record<string, APWithTrain>;

const url = process.env.WIFI_URL;
const username = process.env.WIFI_USER;
const password = process.env.WIFI_PASS;
const refreshTime =
  Number.parseInt(process.env.WIFI_REFRESH || '5', 10) * 60 * 1000;

if (process.env.NODE_ENV !== 'test') {
  setInterval(fetchWifiData, refreshTime);
  fetchWifiData();
}

let wifiData: TransformedWifiData;

export async function fetchWifiData() {
  if (!url || !username || !password) {
    return;
  }
  try {
    logger.debug('Fetching WifiData');
    const data: WifiData = (
      await request.get(url, {
        headers: {
          Authorization: Buffer.from(`${username}:${password}`).toString(
            'base64'
          ),
        },
      })
    ).data;

    // error handling if transmission failed
    if (data && data.traindata) {
      wifiData = transformWifiData(data);
      logger.debug('Fetched WifiData');
    }
  } catch (e) {
    logger.error(e, 'WifiData fetch failed');
  }
}

function transformWifiData(data: WifiData) {
  const result: TransformedWifiData = {};

  data.traindata.forEach((td) => {
    td.ap_list.forEach((ap) => {
      result[ap.uic.replace('-', '')] = {
        ...ap,
        trainTimestamp: td.timestamp * 1000,
        trainBR: td.train.br,
      };
    });
  });

  return result;
}

export function getAP(uic: string) {
  return wifiData ? wifiData[uic] : undefined;
}
