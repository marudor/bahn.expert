// @flow
import { initialize } from 'unleash-client';

initialize({
  url: process.env.FEATURE_URL,
  instanceId: process.env.FEATURE_ID,
  appName: process.env.FEATURE_ENV,
});
