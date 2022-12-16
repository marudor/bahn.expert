import type { AxiosRequestConfig } from 'axios';

const possibleAppVersions = ['3.18.0', '3.17.1'];
const possibleScales = ['2.00', '3.00'];
const possibleTypes = ['iPhone', 'iPad'];
const possibleOSVersions = ['14.8.1', '15.5', '15.6.1', '15.6'];

function getRandomOfArray<T>(values: T[]): T {
  const r = Math.round(Math.random() * (values.length - 1));
  return values[r];
}

function randomUseragent() {
  const appVersion = getRandomOfArray(possibleAppVersions);
  const type = getRandomOfArray(possibleTypes);
  const scale = getRandomOfArray(possibleScales);
  const osVersion = getRandomOfArray(possibleOSVersions);

  return `Bahnhof live/${appVersion} (${type}; iOS ${osVersion}; Scale/${scale})`;
}

export function addUseragent(
  userAgentFunction: () => string = randomUseragent,
  req: AxiosRequestConfig,
): AxiosRequestConfig {
  const headers = req.headers || {};
  headers['user-agent'] = userAgentFunction();
  req.headers = headers;
  return req;
}
