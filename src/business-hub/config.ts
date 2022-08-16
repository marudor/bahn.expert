import { Configuration } from 'business-hub/generated';

export const risStationsConfiguration = new Configuration({
  apiKey: process.env.RIS_STATIONS_KEY,
  basePath: process.env.RIS_STATIONS_URL,
  baseOptions: {
    headers: {
      'user-agent': process.env.USER_AGENT || 'bahnhofs-abfahrten-default',
      'DB-Api-Key': process.env.RIS_STATIONS_CLIENT_SECRET,
      'DB-Client-Id': process.env.RIS_STATIONS_CLIENT_ID,
    },
  },
});
