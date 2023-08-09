import { Cache, parseCacheTTL } from '@/server/cache';

const defineCacheTests = (createCache: () => Cache<unknown>) => {
  const cache: Cache<unknown> = createCache();

  afterAll(async () => {
    await cache.clearAll();
  });

  it('can set explicit undefined', async () => {
    await cache.set('set-explicit-undef', undefined);
    expect(await cache.get('set-explicit-undef')).toBeUndefined();
  });
  it('can set implicit undefined', async () => {
    // @ts-expect-error test only
    await cache.set('set-implicit-undef');
    expect(await cache.get('set-implicit-undef')).toBeUndefined();
  });
  it('can set null', async () => {
    await cache.set('set-null', null);
    expect(await cache.get('set-null')).toBeNull();
  });

  it('can save objects', async () => {
    const testObject = {
      foo: '1',
      bar: '2',
      foobar: undefined,
      really: null,
    };

    await cache.set('obj', testObject);
    expect(await cache.get('obj')).toEqual(testObject);
  });
};

describe('Cache', () => {
  describe('memory', () => {
    defineCacheTests(() => new Cache(0, undefined, { skipRedis: true }));
  });

  if (process.env.REDIS_HOST) {
    describe('redis', () => {
      defineCacheTests(() => new Cache(1, undefined, { skipMemory: true }));
    });
  }
});

describe('parse Cache TTL', () => {
  const defaultTTL = 'PT2M';
  it('undefined', () => {
    expect(parseCacheTTL(defaultTTL, undefined)).toBe(defaultTTL);
  });
  it('seconds', () => {
    expect(parseCacheTTL(defaultTTL, '3600')).toBe('PT3600S');
  });
  it('iso', () => {
    expect(parseCacheTTL(defaultTTL, 'PT4M')).toBe('PT4M');
  });
  it('invalid iso', () => {
    expect(parseCacheTTL(defaultTTL, 'Something')).toBe(defaultTTL);
  });
  it('calendar problems', () => {
    expect(parseCacheTTL(defaultTTL, 'P4M')).toBe(defaultTTL);
  });
});
