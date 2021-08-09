import { Configuration } from 'business-hub/generated';

export const risStationsConfiguration = new Configuration({
  apiKey:
    // Community key by Bahnhof Live App
    // https://github.com/dbbahnhoflive/dbbahnhoflive-android/blob/master/modules/core/build.gradle#L15
    process.env.BUSINESS_HUB_STOP_PLACES_KEY ||
    'TOL1jxXeqIW72s7vKPCcUuPNqFJTvPQx',
});
