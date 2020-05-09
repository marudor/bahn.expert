import 'core-js/stable';
import Nock from 'nock';

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
