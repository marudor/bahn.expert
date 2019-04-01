// @flow
import { initialize } from 'unleash-client';

const url = process.env.FEATURE_URL;
const instanceId = process.env.FEATURE_ID;
const appName = process.env.FEATURE_ENV;

if (url && instanceId && appName) {
  initialize({
    url,
    instanceId,
    appName,
  });
}
