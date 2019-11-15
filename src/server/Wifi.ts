import { AP, WifiData } from 'types/Wifi';
import axios from 'axios';
import config from 'server/config';

interface APWithTrain extends AP {
  trainTimestamp: number;
  trainBR: string;
}

type TransformedWifiData = Record<string, APWithTrain>;

const refreshTime =
  Number.parseInt(process.env.WIFI_REFRESH || '5', 10) * 60 * 1000;

if (process.env.NODE_ENV !== 'test') {
  setInterval(fetchWifiData, refreshTime);

  fetchWifiData();
}

let wifiData: TransformedWifiData;

export async function fetchWifiData() {
  if (!config.wifi) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log('Fetching WifiData');
  const data: WifiData = (
    await axios.get(config.wifi.url, {
      auth: {
        username: config.wifi.user,
        password: config.wifi.pass,
      },
    })
  ).data;

  // error handling if transmission failed
  if (data && data.traindata) {
    wifiData = transformWifiData(data);
    // eslint-disable-next-line no-console
    console.log('Fetched WifiData');
  }
}

function transformWifiData(data: WifiData) {
  const result: TransformedWifiData = {};

  data.traindata.forEach(td => {
    td.ap_list.forEach(ap => {
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
