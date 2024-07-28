import { disconnectRedis } from '@/server/cache';
import Nock from 'nock';
import { afterAll, beforeAll, expect } from 'vitest';

expect(new Date().getTimezoneOffset()).toBe(0);

beforeAll(() => {
	Nock.disableNetConnect();
	Nock.enableNetConnect(/127\.0\.0\.1/);
});

afterAll(() => {
	Nock.restore();
	disconnectRedis();
});
