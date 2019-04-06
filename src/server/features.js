// @flow
const Unleash = require('unleash-client');

const url = process.env.FEATURE_URL;
const instanceId = process.env.FEATURE_ID;
const appName = process.env.FEATURE_ENV;

if (url && instanceId && appName) {
  Unleash.initialize({
    url,
    instanceId,
    appName,
  });
} else {
  // eslint-disable-next-line no-console
  console.log('Overriding feature stuff to always true!');
  // $FlowFixMe
  Unleash.isEnabled = () => true;
}

export const featureKeys = ['google-analytics', 'routing'];
export function getFeatures(): Features {
  return featureKeys.reduce<Features>((features, key) => {
    features[key] = Unleash.isEnabled(key);

    return features;
    // $FlowFixMe - this works
  }, {});
}
