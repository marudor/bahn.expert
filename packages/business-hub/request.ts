import Axios from 'axios';

// Community key by Bahnhof Live App
// https://github.com/dbbahnhoflive/dbbahnhoflive-android/blob/master/modules/core/build.gradle#L15
const apiKey =
  process.env.BUSINESS_HUB_STOP_PLACES_KEY ||
  'TOL1jxXeqIW72s7vKPCcUuPNqFJTvPQx';

export const request = Axios.create({
  baseURL: 'https://gateway.businesshub.deutschebahn.com',
  headers: {
    'user-agent': 'marudor.de',
    'db-api-key': apiKey,
  },
});
