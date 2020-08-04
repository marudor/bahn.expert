import Axios from 'axios';

// Community key by Bahnhof Live App
// https://github.com/dbbahnhoflive/dbbahnhoflive-android/blob/master/modules/core/build.gradle#L15
const apiKey =
  process.env.BUSINESS_HUB_STOP_PLACES_KEY ||
  'TOL1jxXeqIW72s7vKPCcUuPNqFJTvPQx';
export const canUseBusinessHub =
  Boolean(apiKey) || process.env.NODE_ENV === 'test';

export const request = Axios.create({
  baseURL: 'https://gateway.businesshub.deutschebahn.com',
  headers: {
    key: apiKey,
  },
});

if (!canUseBusinessHub) {
  console.warn(
    'No BusinessHub API Key provided. Station search will be degraded Quality!'
  );
}
