/* eslint-disable unicorn/prefer-module */
import { disconnectRedis } from '@/server/cache';
import Nock from 'nock';

// eslint-disable-next-line jest/no-standalone-expect
expect(new Date().getTimezoneOffset()).toBe(0);

const isoDateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}\.\d*)(?:Z|([+-])([\d:|]*))?$/;
globalThis.parseJson = (json: string) => {
  try {
    return JSON.parse(json, (_key, value) => {
      if (typeof value === 'string' && isoDateRegex.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return json;
    // Ignoring
  }
};

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.enableNetConnect(/127\.0\.0\.1/);
});

afterAll(() => {
  Nock.restore();
  disconnectRedis();
});
