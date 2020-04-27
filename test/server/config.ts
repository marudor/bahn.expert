import 'core-js/stable';
import Nock from 'nock';
import path from 'path';

// Custom React setup
global.M = require('react').createElement;
global.MF = require('react').Fragment;

// eslint-disable-next-line jest/no-standalone-expect
expect(new Date().getTimezoneOffset()).toBe(0);

beforeAll(() => {
  Nock.disableNetConnect();
  Nock.enableNetConnect(/127\.0\.0\.1/);

  Nock('http://example.com')
    .get('/')
    .replyWithFile(
      200,
      path.resolve(__dirname, '__fixtures__/wifiTraindata.json')
    );
});

let cache: any;

beforeAll(() => {
  const createNewCache = require('server/cache').createNewCache;

  cache = createNewCache(0, 0);
});

beforeEach(async () => {
  // @ts-ignore
  if (cache.store.getClient) {
    // @ts-ignore
    await cache.store.getClient().flushall();
  }
});

afterAll(() => {
  const cleanupCaches = require('server/cache').cleanupCaches;

  Nock.restore();
  cleanupCaches();
});
