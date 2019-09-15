import { AP, WifiData } from 'types/Wifi';
import axios from 'axios';

type TransformedWifiData = Record<string, AP>;

const url = process.env.WIFI_URL;
const username = process.env.WIFI_USER;
const password = process.env.WIFI_PASS;
const refreshTime =
  Number.parseInt(process.env.WIFI_REFRESH || '5', 10) * 60 * 1000;

setInterval(fetchWifiData, refreshTime);

let wifiData: TransformedWifiData;

async function fetchWifiData() {
  if (!url || !username || !password) {
    return;
  }
  // eslint-disable-next-line no-console
  console.log('Fetching WifiData');
  const data: WifiData = (await axios.get(url, {
    auth: {
      username,
      password,
    },
  })).data;

  wifiData = transformWifiData(data);
  // eslint-disable-next-line no-console
  console.log('Fetched WifiData');
}
fetchWifiData();

function transformWifiData(data: WifiData) {
  const result: TransformedWifiData = {};

  data.traindata.forEach(td => {
    td.ap_list.forEach(ap => {
      result[ap.uic.replace('-', '')] = ap;
    });
  });

  return result;
}

export function getAP(uic: string): AP | undefined {
  return wifiData ? wifiData[uic] : undefined;
}

export async function getWifiData() {
  if (!wifiData) {
    await fetchWifiData();
  }

  return wifiData;
}
