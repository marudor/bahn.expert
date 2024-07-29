import createCtxRecon from '@/server/HAFAS/helper/createCtxRecon';
import type {
	RouteValidArrivalStop,
	RouteValidDepartureStop,
} from '@/types/HAFAS/JourneyDetails';
import { addSeconds, parse } from 'date-fns';
import { describe, expect, it } from 'vitest';

describe('createCtxRecon', () => {
	const expectedDeparture = '201912131045';
	const expectedArrival = '201912131220';
	const departureTime = parse(expectedDeparture, 'yyyyMMddHHmm', 0);
	const arrivalTime = parse(expectedArrival, 'yyyyMMddHHmm', 0);

	const firstStop: RouteValidDepartureStop = {
		station: {
			evaNumber: '123',
			name: 'dummy',
		},
		departure: {
			scheduledTime: departureTime,
			time: departureTime,
		},
	};

	const lastStop: RouteValidArrivalStop = {
		station: {
			evaNumber: '321',
			name: 'otherDummy',
		},
		arrival: {
			scheduledTime: arrivalTime,
			time: addSeconds(arrivalTime, 123),
		},
	};

	it('Default replacementNumber is one', () => {
		expect(
			createCtxRecon({
				firstStop,
				lastStop,
				trainName: 'test',
			}),
		).toBe(
			`¶HKI¶T$A=1@L=${firstStop.station.evaNumber}@a=128@$A=1@L=${lastStop.station.evaNumber}@a=128@$${expectedDeparture}$${expectedArrival}$test$$1$`,
		);
	});

	it('Ersatzfahrt has replacement 2', () => {
		expect(
			createCtxRecon({
				firstStop,
				lastStop,
				trainName: 'ersatz',
				messages: [
					{
						type: '',
						code: '',
						icoX: 0,
						txtN: 'Ersatzfahrt',
					},
				],
			}),
		).toBe(
			`¶HKI¶T$A=1@L=${firstStop.station.evaNumber}@a=128@$A=1@L=${lastStop.station.evaNumber}@a=128@$${expectedDeparture}$${expectedArrival}$ersatz$$2$`,
		);
	});
});
