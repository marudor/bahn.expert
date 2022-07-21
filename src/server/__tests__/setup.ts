import 'core-js/stable';
import Nock from 'nock';

// eslint-disable-next-line jest/no-standalone-expect
expect(new Date().getTimezoneOffset()).toBe(0);

const isoDateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
globalThis.parseJson = (json: string) => {
  try {
    return JSON.parse(json, (_key, value) => {
      if (typeof value === 'string') {
        if (isoDateRegex.exec(value)) {
          return new Date(value);
        }
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

let cache: any;

beforeAll(() => {
  const createNewCache = require('server/cache').createNewCache;

  cache = createNewCache(0, 0);
});

beforeEach(async () => {
  if (cache.store.getClient) {
    await cache.store.getClient().flushall();
  }
});

afterAll(() => {
  const cleanupCaches = require('server/cache').cleanupCaches;

  Nock.restore();
  cleanupCaches();
});
