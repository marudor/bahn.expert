import { getLageplan } from '@/server/StopPlace/Lageplan';
import {
	getStopPlaceByEva,
	getStopPlaceByRl100,
	searchStopPlace,
} from '@/server/StopPlace/search';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import { AuslastungsValue } from '@/types/routing';
import type {
	TrainOccupancy,
	TrainOccupancyList,
	VRRTrainOccupancy,
	VRRTrainOccupancyValues,
} from '@/types/stopPlace';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';

function mapVrrOccupancy(
	vrrOccupancy: VRRTrainOccupancyValues,
): AuslastungsValue {
	switch (vrrOccupancy) {
		case 1: {
			return AuslastungsValue.Gering;
		}
		case 2: {
			return AuslastungsValue.Hoch;
		}
		case 3: {
			return AuslastungsValue.SehrHoch;
		}
	}
}

export const stopPlaceRpcRouter = rpcAppRouter({
	occupancy: rpcProcedure
		.input(z.string())
		.query(async ({ input: evaNumber }) => {
			try {
				const result = (
					await axios.get<TrainOccupancy<VRRTrainOccupancy>>(
						`https://vrrf.finalrewind.org/_eva/occupancy-by-eva/${evaNumber}.json`,
					)
				).data;

				const normalizedResult: TrainOccupancyList = {};
				for (const [trainNumber, vrrOccupancy] of Object.entries(
					result.train,
				)) {
					normalizedResult[trainNumber] = vrrOccupancy?.occupancy
						? {
								first: mapVrrOccupancy(vrrOccupancy.occupancy),
								second: mapVrrOccupancy(vrrOccupancy.occupancy),
							}
						: null;
				}

				return normalizedResult;
			} catch {
				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			}
		}),
	lageplan: rpcProcedure
		.input(
			z.object({
				stopPlaceName: z.string(),
				evaNumber: z.string(),
			}),
		)
		.query(({ input: { stopPlaceName, evaNumber } }) => {
			return getLageplan(stopPlaceName, evaNumber);
		}),
	byKey: rpcProcedure
		.input(
			z.string({
				description: 'EvaNumber or RL100',
			}),
		)
		.query(async ({ input: key }) => {
			let stopPlace: Awaited<ReturnType<typeof getStopPlaceByEva>>;
			if (key.length < 6) {
				stopPlace = await getStopPlaceByRl100(key);
			} else {
				stopPlace = await getStopPlaceByEva(key);
			}
			if (stopPlace) {
				return stopPlace;
			}
			throw new TRPCError({
				code: 'NOT_FOUND',
			});
		}),
	byName: rpcProcedure
		.input(
			z.object({
				searchTerm: z.string(),
				max: z.number().optional(),
				filterForIris: z.boolean().optional(),
			}),
		)
		.query(({ input: { searchTerm, filterForIris, max } }) => {
			return searchStopPlace(searchTerm, max, filterForIris);
		}),
});
