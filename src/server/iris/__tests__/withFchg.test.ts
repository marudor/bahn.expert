import fs from 'node:fs';
import path from 'node:path';
import {
	mockFchg,
	mockLageplan,
	mockSearch,
} from '@/server/__tests__/mockHelper';
import { Timetable } from '@/server/iris/Timetable';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

describe('withFchg', () => {
	beforeAll(() => {
		vi.useFakeTimers({
			now: 1552824000000,
		});
	});
	afterAll(() => {
		vi.useRealTimers();
	});
	const baseFixturePath = '__fixtures__';
	const fchgFixtures = fs.readdirSync(
		path.resolve(__dirname, baseFixturePath, 'fchg'),
	);

	for (const file of fchgFixtures) {
		it(file, async () => {
			const fchgXml = fs.readFileSync(
				path.resolve(__dirname, baseFixturePath, 'fchg', file),
				'utf8',
			);
			const planxml = fs.readFileSync(
				path.resolve(__dirname, baseFixturePath, 'plan', file),
				'utf8',
			);

			mockLageplan();
			mockFchg(fchgXml);
			mockSearch(3, ['', planxml]);
			const timetable = new Timetable('test', 'test', {
				lookahead: 120,
				lookbehind: 60,
			});

			await expect(timetable.start()).resolves.toMatchSnapshot();
		});
	}
});
