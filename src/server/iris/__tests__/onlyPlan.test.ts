import fs from 'node:fs';
import path from 'node:path';
import {
	mockFchg,
	mockLageplan,
	mockSearch,
} from '@/server/__tests__/mockHelper';
import { Timetable } from '@/server/iris/Timetable';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

describe('onlyPlan', () => {
	beforeAll(() => {
		vi.useFakeTimers({
			now: 1552824000000,
		});
	});
	afterAll(() => {
		vi.useRealTimers();
	});
	const baseFixturePath = '__fixtures__/plan';
	const fixtures = fs.readdirSync(path.resolve(__dirname, baseFixturePath));

	for (const file of fixtures) {
		it(file, async () => {
			const inXml = fs.readFileSync(
				path.resolve(__dirname, baseFixturePath, file),
				'utf8',
			);

			mockLageplan();
			mockFchg();
			mockSearch(3, ['', inXml]);
			const timetable = new Timetable('test', 'test', {
				lookahead: 120,
				lookbehind: 60,
			});

			await expect(timetable.start()).resolves.toMatchSnapshot();
		});
	}
});
