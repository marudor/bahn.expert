import cacheManager from 'cache-manager';

const mocked = jest.genMockFromModule<typeof import('../cache')>(
  'server/cache'
);

export const CacheDatabases = mocked.CacheDatabases;
export function createNewCache() {
  return cacheManager.caching({
    store: 'none',
    ttl: 0,
  });
}
