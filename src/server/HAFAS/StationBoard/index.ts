import makeRequest from '@/server/HAFAS/Request';
import type { AllowedHafasProfile, JourneyFilter } from '@/types/HAFAS';
import type { StationBoardRequest } from '@/types/HAFAS/StationBoard';
import type {
	ArrivalStationBoardEntry,
	DepartureStationBoardEntry,
	StationBoardEntry,
} from '@/types/stationBoard';
import { tz } from '@date-fns/tz';
import { format } from 'date-fns';
import parse from './parse';

interface Options {
	date?: Date;
	direction?: string;
	station: string;
	type: 'ARR' | 'DEP';
	filter?: JourneyFilter[];
}
function stationBoard(
	options: Omit<Options, 'type'> & { type: 'ARR' },
	profile?: AllowedHafasProfile,
	raw?: boolean,
): Promise<ArrivalStationBoardEntry[]>;
function stationBoard(
	options: Omit<Options, 'type'> & { type: 'DEP' },
	profile?: AllowedHafasProfile,
	raw?: boolean,
): Promise<DepartureStationBoardEntry[]>;
function stationBoard(
	{ station, date = new Date(), type, direction, filter }: Options,
	profile?: AllowedHafasProfile,
	raw?: boolean,
): Promise<StationBoardEntry[]> {
	const req: StationBoardRequest = {
		req: {
			type,
			getPasslist: true,
			maxJny: 250,
			jnyFltrL: filter,
			date: format(date, 'yyyyMMdd', {
				in: tz('Europe/Berlin'),
			}),
			time: format(date, 'HHmmss', {
				in: tz('Europe/Berlin'),
			}),
			stbLoc: {
				lid: `A=1@L=${station}`,
			},
			dirLoc: direction
				? {
						lid: `A=1@L=${direction}`,
					}
				: undefined,
		},
		meth: 'StationBoard',
	};

	return makeRequest(req, raw ? undefined : parse, profile);
}
export default stationBoard;
