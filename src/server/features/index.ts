import * as Unleash from 'unleash-client';
import DefaultFeatures from './default';

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
  // @ts-ignore
  Unleash.isEnabled = (key: string) =>
    Boolean(require('./default').default[key]);
}

export const featureKeys = Object.keys(DefaultFeatures);

export type Features = typeof DefaultFeatures;

export function getFeatures(): Features {
  return featureKeys.reduce<Features>((features, key) => {
    features[key as keyof Features] = Unleash.isEnabled(key);

    return features;
    // @ts-ignore this works
  }, {});
}
