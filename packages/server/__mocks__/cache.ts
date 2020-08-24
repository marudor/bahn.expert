import cacheManager from 'cache-manager';

const mocked = jest.genMockFromModule<typeof import('../cache')>(
  'server/cache',
);

// @ts-ignore
mocked.createNewCache = () => {
  return cacheManager.caching({
    store: 'none',
    ttl: 0,
  });
};

module.exports = mocked;
