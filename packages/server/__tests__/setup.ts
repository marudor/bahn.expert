import 'core-js/stable';
import Nock from 'nock';

// Custom React setup
global.M = require('react').createElement;
global.MF = require('react').Fragment;

// eslint-disable-next-line jest/no-standalone-expect
expect(new Date().getTimezoneOffset()).toBe(0);

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
