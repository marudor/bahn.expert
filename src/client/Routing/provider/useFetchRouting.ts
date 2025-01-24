import {
	useRoutingConfig,
	useRoutingSettings,
} from '@/client/Routing/provider/RoutingConfigProvider';
import { useRouting } from '@/client/Routing/provider/RoutingProvider';
import { useRoutingNavigate } from '@/client/Routing/util';
import { uniqBy } from '@/client/util';
import { trpc } from '@/router';
import type { RoutingResult } from '@/types/routing';
import type { MinimalStopPlace } from '@/types/stopPlace';
import { useCallback } from 'react';

export const useFetchRouting = () => {
	const {
		setRoutes,
		setEarlierContext,
		setLaterContext,
		earlierContext,
		laterContext,
		setError,
	} = useRouting();
	const { start, destination, date, via, touchedDate, departureMode } =
		useRoutingConfig();
	const settings = useRoutingSettings();
	const navigate = useRoutingNavigate();
	const trpcUtils = trpc.useUtils();

	const getRouteSettings = useCallback(
		(commonStart = start, commonDestination = destination, commonVia = via) =>
			commonStart &&
			commonDestination &&
			commonStart.evaNumber !== commonDestination.evaNumber
				? {
						start: {
							evaNumber: commonStart?.evaNumber,
							type: 'stopPlace',
						} as const,
						destination: {
							evaNumber: commonDestination?.evaNumber,
							type: 'stopPlace',
						} as const,
						via: commonVia.filter(Boolean).map((v) => ({
							evaNumber: v.evaNumber,
						})),
						...settings,
						maxChanges: Number.parseInt(settings.maxChanges || '-1'),
						transferTime: Number.parseInt(settings.transferTime || '0'),
					}
				: undefined,
		[destination, settings, start, via],
	);

	const fetchRoutes = useCallback(
		async (
			start?: MinimalStopPlace,
			destination?: MinimalStopPlace,
			via: MinimalStopPlace[] = [],
		) => {
			const routeSettings = getRouteSettings(start, destination, via);
			if (!routeSettings) {
				return;
			}
			setError(undefined);
			setRoutes(undefined);
			let routingResult: RoutingResult;
			try {
				routingResult = await trpcUtils.bahn.routing.fetch(
					{
						time: touchedDate ? date : new Date(),
						searchForDeparture: departureMode === 'ab',
						maxChanges: routeSettings.maxChanges,
						start: routeSettings.start,
						destination: routeSettings.destination,
						onlyRegional: routeSettings.onlyRegional,
						transferTime: routeSettings.transferTime,
						via: routeSettings.via,
					},
					{
						trpc: {
							context: {
								skipBatch: true,
							},
						},
					},
				);

				setRoutes(routingResult.routes);
				setEarlierContext(routingResult.context.earlier);
				setLaterContext(routingResult.context.later);
			} catch (error: any) {
				setError(error);
			}
		},
		[
			trpcUtils.bahn.routing,
			date,
			setEarlierContext,
			setError,
			setLaterContext,
			setRoutes,
			touchedDate,
			departureMode,
			getRouteSettings,
		],
	);

	const fetchRoutesAndNavigate = useCallback(
		(
			start?: MinimalStopPlace,
			destination?: MinimalStopPlace,
			via: MinimalStopPlace[] = [],
		) => {
			if (start && destination && start.evaNumber !== destination.evaNumber) {
				void fetchRoutes(start, destination, via);
				navigate(start, destination, via, touchedDate ? date : null);
			}
		},
		[date, fetchRoutes, touchedDate, navigate],
	);

	const fetchContext = useCallback(
		async (type: 'earlier' | 'later') => {
			const routeSettings = getRouteSettings();
			if (!routeSettings) return;
			let routingResult: RoutingResult;

			try {
				routingResult = await trpcUtils.bahn.routing.fetch(
					{
						time: touchedDate ? date : new Date(),
						searchForDeparture: departureMode === 'ab',
						maxChanges: routeSettings.maxChanges,
						start: routeSettings.start,
						destination: routeSettings.destination,
						onlyRegional: routeSettings.onlyRegional,
						transferTime: routeSettings.transferTime,
						via: routeSettings.via,
						ctxScr: type === 'earlier' ? earlierContext : laterContext,
					},
					{
						trpc: {
							context: {
								skipBatch: true,
							},
						},
					},
				);

				setRoutes((oldRoutes = []) => {
					const newRoutes =
						type === 'earlier'
							? [...routingResult.routes, ...oldRoutes]
							: [...oldRoutes, ...routingResult.routes];

					return uniqBy(newRoutes, 'id');
				});

				if (type === 'earlier') {
					setEarlierContext(routingResult.context.earlier);
				} else {
					setLaterContext(routingResult.context.later);
				}
			} catch {
				// we ignore this request and let the user retry for now
			}
		},
		[
			trpcUtils.bahn.routing,
			date,
			touchedDate,
			departureMode,
			getRouteSettings,
			earlierContext,
			laterContext,
			setEarlierContext,
			setLaterContext,
			setRoutes,
		],
	);

	const clearRoutes = useCallback(() => {
		setRoutes([]);
		setEarlierContext(undefined);
		setLaterContext(undefined);
	}, [setEarlierContext, setLaterContext, setRoutes]);

	return {
		fetchRoutes,
		fetchContext,
		clearRoutes,
		fetchRoutesAndNavigate,
	};
};
