import 'core-js/stable';
import { cleanupCaches, createNewCache } from 'server/cache';
import Nock from 'nock';
import path from 'path';

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

beforeAll(async () => {
  const cache = createNewCache(0, 0);

  // @ts-expect-error
  if (cache.store.getClient) {
    // @ts-expect-error
    await cache.store.getClient().flushall();
  }
});

afterAll(() => {
  Nock.restore();
  cleanupCaches();
});
