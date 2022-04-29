import { Configuration } from 'business-hub/generated';

export const risStationsConfiguration = new Configuration({
  apiKey:
    // Community key by Bahnhof Live App
    // https://github.com/dbbahnhoflive/dbbahnhoflive-android/blob/master/modules/core/build.gradle#L15
    process.env.RIS_STATIONS_KEY || 'a5d3c62e032912922ed46cdacdb47940',
  baseOptions: {
    headers: {
      'user-agent': 'marudor.de',
    },
  },
});
