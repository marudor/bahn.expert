import { getLageplan } from '@/server/StopPlace/Lageplan';
import {
	getStopPlaceByEva,
	getStopPlaceByRl100,
	searchStopPlace,
} from '@/server/StopPlace/search';
import { axiosUpstreamInterceptor } from '@/server/admin';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { z } from 'zod';

const occupancyAxios = axios.create();
axiosUpstreamInterceptor(occupancyAxios, 'vrrf-occupancy');

export const stopPlaceRpcRouter = rpcAppRouter({
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
