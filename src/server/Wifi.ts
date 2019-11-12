import { AP, WifiData } from 'types/Wifi';
import axios from 'axios';

interface APWithTrain extends AP {
  trainTimestamp: number;
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

async function fetchWifiData() {
  if (!url || !username || !password) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log('Fetching WifiData');
  const data: WifiData = (
    await axios.get(url, {
      auth: {
        username,
        password,
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
      };
    });
  });

  return result;
}

export function getAP(uic: string) {
  return wifiData ? wifiData[uic] : undefined;
}
