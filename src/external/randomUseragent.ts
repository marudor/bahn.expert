import type { InternalAxiosRequestConfig } from 'axios';

const possibleBahnhofLiveAppVersions = [
  '3.20.1',
  '3.20.2',
  '3.21.0',
  '3.22.0',
  '3.22.1',
];
const possibleScales = ['2.00', '3.00'];
const possibleTypes = ['iPhone', 'iPad'];
const possibleOSVersions = [
  '14.8.1',
  '15.5',
  '15.6',
  '15.6.1',
  '16.3.0',
  '16.4.0',
  '16.5.0',
  '16.5.1',
  '16.6',
];
const possibleDBNavigatorVersions = ['23040000'];
const possibleFullDeviceTypes = [
  'iPhone13,2',
  'iPhone13,1',
  'iPhone14,1',
  'iPhone14,2',
];

function getRandomOfArray<T>(values: T[]): T {
  const r = Math.round(Math.random() * (values.length - 1));
  return values[r];
}

export function randomDBNavigatorUseragent(): string {
  const appVersion = getRandomOfArray(possibleDBNavigatorVersions);
  const fullDeviceType = getRandomOfArray(possibleFullDeviceTypes);
  const osVersion = getRandomOfArray(possibleOSVersions);

  return `Mozilla/5.0 (iPhone; CPU iPhone OS ${osVersion.replaceAll(
    '.',
    '_',
  )} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;DBNavigator/${appVersion}/iOS_${osVersion}/${fullDeviceType}/C:b`;
}

export function randomBahnhofLiveUseragent(): string {
  const appVersion = getRandomOfArray(possibleBahnhofLiveAppVersions);
  const type = getRandomOfArray(possibleTypes);
  const scale = getRandomOfArray(possibleScales);
  const osVersion = getRandomOfArray(possibleOSVersions);

  return `Bahnhof live/${appVersion} (${type}; iOS ${osVersion}; Scale/${scale})`;
}

export function addUseragent(
  userAgentFunction: () => string = randomBahnhofLiveUseragent,
  req: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const headers = req.headers || {};
  headers['user-agent'] = userAgentFunction();
  req.headers = headers;
  return req;
}
