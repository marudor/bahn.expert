/* eslint-disable unicorn/prefer-module */
import cacheManager from 'cache-manager';

const mocked =
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  jest.createMockFromModule<typeof import('../cache')>('../cache');

// @ts-expect-error mocking
mocked.createNewCache = () => {
  return cacheManager.caching({
    store: 'none',
    ttl: 0,
  });
};

module.exports = mocked;
