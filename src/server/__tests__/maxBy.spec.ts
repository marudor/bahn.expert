import { maxBy } from '@/client/util';
import { describe, expect, it } from 'vitest';

describe('maxBy', () => {
	it('simple', () => {
		expect(maxBy([1, 2, 3])).toBe(3);
		expect(maxBy([2, 3, 1])).toBe(3);
		expect(maxBy([1, 2])).toBe(2);
		expect(maxBy([1])).toBe(1);
		expect(maxBy([])).toBe(undefined);
	});
	it('identifier', () => {
		expect(
			maxBy(
				[
					{
						a: 1,
					},
					{
						a: 2,
					},
				],
				'a',
			),
		).toEqual({
			a: 2,
		});
		expect(
			maxBy(
				[
					{
						a: 2,
					},
					{
						a: 4,
					},
				],
				'a',
			),
		).toEqual({
			a: 4,
		});
	});
	it('function', () => {
		expect(
			maxBy(
				[
					{
						a: 1,
					},
					{
						a: 2,
					},
				],
				(a) => a.a,
			),
		).toEqual({
			a: 2,
		});
		expect(
			maxBy(
				[
					{
						a: 1,
						b: '123',
					},
					{
						a: 2,
						b: '21',
					},
				],
				(a) => Number.parseInt(a.b),
			),
		).toEqual({
			a: 1,
			b: '123',
		});
	});
});
