import type { InternalAxiosRequestConfig } from 'axios';

const possibleBahnhofLiveAppVersions = [
  '3.21.0',
  '3.22.0',
  '3.22.1',
  '3.23.0',
  '3.23.1',
];
const possibleScales = ['2.00', '3.00'];
const possibleTypes = ['iPhone', 'iPad'];
const possibleOSVersions = [
  '15.5',
  '15.6',
  '15.6.1',
  '16.3.0',
  '16.4.0',
  '16.5.0',
  '16.5.1',
  '16.6',
  '17.0',
  '17.1',
  '17.1.1',
];

export function getRandomOfArray<T>(values: T[]): T {
  const r = Math.round(Math.random() * (values.length - 1));
  return values[r];
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
