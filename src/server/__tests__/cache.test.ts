import { parseCacheTTL } from '@/server/cache';

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
