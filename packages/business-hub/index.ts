import Axios from 'axios';

const apiKey = process.env.BUSINESS_HUB_STOP_PLACES_KEY || '';
export const canUseBusinessHub =
  Boolean(apiKey) || process.env.NODE_ENV === 'test';

export const axios = Axios.create({
  headers: {
    key: apiKey,
  },
  baseURL: 'https://api.businesshub.deutschebahn.com/',
});

if (!canUseBusinessHub) {
  console.warn(
    'No BusinessHub API Key provided. Station search will be degraded Quality!'
  );
}
