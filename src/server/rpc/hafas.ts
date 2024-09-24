import StationBoard from '@/server/HAFAS/StationBoard';
import StationBoardToTimetables from '@/server/HAFAS/StationBoard/StationBoardToTimetables';
import { tripSearch } from '@/server/HAFAS/TripSearch/TripSearch';
import { stopOccupancy } from '@/server/HAFAS/occupancy';
import { vrrOccupancy } from '@/server/StopPlace/vrrOccupancy';
import { getOccupancy } from '@/server/coachSequence/occupancy';
import { additionalJourneyInformation } from '@/server/journeys/additionalJourneyInformation';
import { rpcAppRouter, rpcProcedure } from '@/server/rpc/base';
import type { AbfahrtenRPCQuery } from '@/server/rpc/iris';
import { AllowedHafasProfile } from '@/types/HAFAS';
import type { RouteAuslastungWithSource } from '@/types/routing';
import type { ArrivalStationBoardEntry } from '@/types/stationBoard';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const routingStopPlaceLocation = z.object({
	type: z.literal('stopPlace'),
	evaNumber: z.string(),
});

const routingCoordinateLocation = z.object({
	type: z.literal('coordinate'),
	latitude: z.number(),
	longitude: z.number(),
});

const routingLocationInput = z.union([
	routingStopPlaceLocation,
	routingCoordinateLocation,
]);

export const hafasRpcRouter = rpcAppRouter({
	irisAbfahrten: rpcProcedure
		.input(
			z.object({
				evaNumber: z.string(),
			}),
		)
		.query(async ({ input: { evaNumber } }) => {
			const hafasDeparture = await StationBoard({
				type: 'DEP',
				station: evaNumber,
			});
			const hafasArrivals = await StationBoard({
				type: 'ARR',
				station: evaNumber,
			}).catch(() => undefined);

			const mappedHafasArrivals =
				hafasArrivals?.reduce(
					(map: Record<string, ArrivalStationBoardEntry>, arrival) => {
						map[`${arrival.jid}${arrival.train.number}`] = arrival;

						return map;
					},
					{},
				) || {};

			const idSet = new Set<string>();

			return {
				lookbehind: [],
				departures: hafasDeparture
					.map((departure) =>
						StationBoardToTimetables(departure, mappedHafasArrivals, idSet),
					)
					.filter(Boolean)
					.slice(0, 75),
				wings: {},
				stopPlaces: [evaNumber],
			};
		}) as AbfahrtenRPCQuery,
	occupancy: rpcProcedure
		.input(
			z.object({
				start: z.string(),
				destination: z.string(),
				plannedDepartureTime: z.date().optional(),
				trainNumber: z.string(),
				stopEva: z.string(),
				journeyId: z.string().optional(),
			}),
		)
		.query(
			async ({
				input: {
					start,
					destination,
					plannedDepartureTime,
					trainNumber,
					stopEva,
					journeyId,
				},
			}) => {
				const [foundOccupancy, foundVrrOccupancy, foundTransportsOccupancy] =
					await Promise.all([
						plannedDepartureTime &&
							stopOccupancy(
								start,
								destination,
								trainNumber,
								plannedDepartureTime,
								stopEva,
							),
						vrrOccupancy(stopEva, trainNumber),
						journeyId ? getOccupancy(journeyId) : undefined,
					]);

				if (foundTransportsOccupancy?.[stopEva]) {
					return {
						source: 'Transports',
						occupancy: foundTransportsOccupancy[stopEva],
					} as RouteAuslastungWithSource;
				}

				if (foundOccupancy) {
					return {
						source: 'HAFAS',
						occupancy: foundOccupancy,
					} as RouteAuslastungWithSource;
				}
				if (foundVrrOccupancy) {
					return {
						source: 'VRR',
						occupancy: foundVrrOccupancy,
					} as RouteAuslastungWithSource;
				}

				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			},
		),
	additionalInformation: rpcProcedure
		.input(
			z.object({
				trainName: z.string(),
				journeyId: z.string(),
				evaNumberAlongRoute: z.string().optional(),
				initialDepartureDate: z.date().optional(),
			}),
		)
		.query(
			async ({
				input: {
					trainName,
					journeyId,
					evaNumberAlongRoute,
					initialDepartureDate,
				},
			}) => {
				const additionalInformation = await additionalJourneyInformation(
					trainName,
					journeyId,
					evaNumberAlongRoute,
					initialDepartureDate,
				);

				if (additionalInformation) {
					return additionalInformation;
				}

				throw new TRPCError({
					code: 'NOT_FOUND',
				});
			},
		),
	tripSearch: rpcProcedure
		.input(
			z.object({
				profile: z
					.nativeEnum(AllowedHafasProfile)
					.default(AllowedHafasProfile.DB),
				start: routingLocationInput,
				destination: routingLocationInput,
				via: z.array(
					z.object({
						evaNumber: z.string(),
						minChangeTime: z.number().optional(),
					}),
				),
				time: z.date().optional(),
				transferTime: z.number().optional(),
				maxChanges: z.number().optional(),
				searchForDeparture: z.boolean().optional(),
				onlyRegional: z.boolean().optional(),
				onlyNetzcard: z.boolean().optional(),
				ctxScr: z.string().optional(),
			}),
		)
		.query(async ({ input: { profile, ...options } }) => {
			return await tripSearch(options, profile);
		}),
});
