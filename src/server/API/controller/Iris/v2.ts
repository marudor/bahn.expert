// import { departureAndArrivals } from '@/external/risBoards';
import { getAbfahrten } from '@/server/iris';
import type { EvaNumber } from '@/types/common';
// import { TimeType } from '@/external/generated/risBoards';
import type { AbfahrtenResult } from '@/types/iris';
// import { addMinutes, isEqual, subMinutes } from 'date-fns';
import {
	Controller,
	Get,
	OperationId,
	Query,
	Route,
	Tags,
} from '@tsoa/runtime';

@Route('/iris/v2')
export class IrisControllerv2 extends Controller {
	/**
	 *
	 * @isInt lookahead
	 * @isInt lookbehind
	 */
	@Get('/abfahrten/{evaNumber}')
	@Tags('IRIS')
	@OperationId('Abfahrten v2')
	abfahrten(
		evaNumber: EvaNumber,
		/** minutes */
		@Query() lookahead = 150,
		/** minutes */
		@Query() lookbehind = 0,
		@Query() startTime?: Date,
	): Promise<AbfahrtenResult> {
		return getAbfahrten(evaNumber, true, {
			lookahead,
			lookbehind,
			startTime,
		});
	}
}
