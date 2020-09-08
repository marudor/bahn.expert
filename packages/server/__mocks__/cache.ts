import cacheManager from 'cache-manager';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const mocked = jest.createMockFromModule<typeof import('../cache')>(
  'server/cache',
);

// @ts-expect-error mocking
mocked.createNewCache = () => {
  return cacheManager.caching({
    store: 'none',
    ttl: 0,
  });
};

module.exports = mocked;
