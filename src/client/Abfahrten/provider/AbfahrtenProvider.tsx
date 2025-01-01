import {
	AbfahrtenConfigProvider,
	useAbfahrtenFetch,
	useAbfahrtenFilter,
} from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import constate from '@/constate';
import type { Abfahrt, AbfahrtenResult } from '@/types/iris';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { PropsFor } from '@mui/system';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC, PropsWithChildren, ReactNode } from 'react';

export type AbfahrtenError =
	| AbfahrtenError$Redirect
	| AbfahrtenError$404
	| AbfahrtenError$Default;
type AbfahrtenError$Redirect = Error & {
	errorType: 'redirect';
	redirect: string;
	station?: undefined;
};

type AbfahrtenError$404 = Error & {
	errorType: '404';
	station?: undefined;
};
interface AbfahrtenError$Default {
	errorType: undefined;
	station?: string;
}

function sortAbfahrtenByTime(a: Abfahrt, b: Abfahrt) {
	const aTime = (a.departure?.time || a.arrival?.time)!;
	const bTime = (b.departure?.time || b.arrival?.time)!;
	return aTime > bTime ? 1 : -1;
}

const useAbfahrtenInner = ({
	searchFunction,
}: PropsWithChildren<{
	searchFunction: (searchTerm: string) => Promise<MinimalStopPlace[]>;
}>) => {
	const [currentStopPlace, setCurrentStopPlace] = useState<MinimalStopPlace>();
	const [departures, setDepartures] = useState<AbfahrtenResult>();
	const [error, setError] = useState<unknown>();
	const abfahrtenFetch = useAbfahrtenFetch();
	const {
		startTime,
		lookahead,
		lookbehind,
		onlyDepartures,
		showCancelled,
		sortByTime,
	} = useCommonConfig();
	const [scrolled, setScrolled] = useState(false);

	const updateCurrentStopPlaceByString = useCallback(
		async (stopPlaceName: string) => {
			setCurrentStopPlace((oldStopPlace) => {
				if (oldStopPlace && oldStopPlace.name !== stopPlaceName) {
					setDepartures(undefined);
				}

				return {
					name: stopPlaceName,
					evaNumber: '',
					availableTransports: [],
				};
			});
			try {
				const stopPlaces = await searchFunction(stopPlaceName);

				if (stopPlaces.length) {
					setCurrentStopPlace(stopPlaces[0]);
				} else {
					setError({
						code: 'NOT_FOUND',
					});
				}
			} catch (e) {
				setError(e);
			}
		},
		[searchFunction],
	);

	useEffect(() => {
		if (!currentStopPlace?.evaNumber) {
			setDepartures(undefined);
			return;
		}
		setError(undefined);

		abfahrtenFetch
			.fetch({
				evaNumber: currentStopPlace.evaNumber,
				lookahead: Number.parseInt(lookahead),
				lookbehind: Number.parseInt(lookbehind),
				startTime,
			})
			.then((deps) => {
				if (deps) {
					setScrolled(false);
					setDepartures(deps);
				}
			})
			.catch((e) => setError(e));
	}, [currentStopPlace, lookahead, lookbehind, startTime, abfahrtenFetch]);

	const { productFilter } = useAbfahrtenFilter();

	const filteredDepartures = useMemo(() => {
		if (!departures) return departures;

		const filtered = {
			departures: departures.departures,
			lookbehind: departures.lookbehind,
		};

		const filterFunctions: ((a: Abfahrt) => boolean)[] = [];

		if (productFilter.length) {
			filterFunctions.push(
				(a: Abfahrt) => !productFilter.includes(a.train.type),
			);
		}
		if (onlyDepartures) {
			filterFunctions.push((a: Abfahrt) => Boolean(a.departure));
		}

		if (!showCancelled) {
			filterFunctions.push((a) => !a.cancelled);
		}

		if (filterFunctions.length) {
			const f = (a: Abfahrt) => filterFunctions.every((fn) => fn(a));

			filtered.departures = filtered.departures.filter(f);
			filtered.lookbehind = filtered.lookbehind.filter(f);
		}

		if (sortByTime) {
			filtered.departures = [...filtered.departures].sort(sortAbfahrtenByTime);
			filtered.lookbehind = [...filtered.lookbehind].sort(sortAbfahrtenByTime);
		}

		return filtered;
	}, [departures, onlyDepartures, productFilter, showCancelled, sortByTime]);

	return {
		error,
		updateCurrentStopPlaceByString,
		currentStopPlace,
		setCurrentStopPlace,
		departures,
		filteredDepartures,
		setDepartures,
		scrolled,
		setScrolled,
	};
};

export const [
	InnerAbfahrtenProvider,
	useAbfahrtenDepartures,
	useCurrentAbfahrtenStopPlace,
	useAbfahrtenError,
	useRawAbfahrten,
] = constate(
	useAbfahrtenInner,
	(v) => ({
		filteredDepartures: v.filteredDepartures,
		departures: v.departures,
	}),
	(v) => v.currentStopPlace,
	(v) => v.error,
	({ departures, currentStopPlace, ...r }) => r,
);

export const useWings = (abfahrt: Abfahrt) => {
	const { departures } = useAbfahrtenDepartures();
	const wings = departures?.wings;

	return useMemo(() => {
		if (wings) {
			const arrivalWings = abfahrt.arrival?.wingIds;

			if (arrivalWings) {
				return arrivalWings.map((w) => wings[w]).filter(Boolean);
			}
			const departureWings = abfahrt.departure?.wingIds;

			if (departureWings) {
				return departureWings.map((w) => wings[w]).filter(Boolean);
			}
		}
	}, [abfahrt.arrival, abfahrt.departure, wings]);
};

const defaultTypes = ['ICE', 'IC', 'EC', 'RE', 'RB', 'S'];

export const useAllTrainTypes = () => {
	const { departures } = useAbfahrtenDepartures();

	return useMemo(() => {
		const typeSet = new Set(defaultTypes);

		if (departures) {
			for (const a of departures.departures) {
				if (a.train.type) {
					typeSet.add(a.train.type);
				}
			}
			for (const a of departures.lookbehind) {
				if (a.train.type) {
					typeSet.add(a.train.type);
				}
			}
		}

		return [...typeSet];
	}, [departures]);
};

export const useRefreshCurrent = (visible = false) => {
	const { setDepartures, setScrolled } = useRawAbfahrten();
	const currentStopPlace = useCurrentAbfahrtenStopPlace();
	const { lookahead, lookbehind } = useCommonConfig();
	const abfahrtenFetch = useAbfahrtenFetch();

	return useCallback(async () => {
		if (currentStopPlace?.evaNumber) {
			if (visible) {
				setScrolled(false);
				setDepartures(undefined);
			}
			const r = await abfahrtenFetch.fetch(
				{
					evaNumber: currentStopPlace.evaNumber,
					lookahead: Number.parseInt(lookahead),
					lookbehind: Number.parseInt(lookbehind),
				},
				{
					// @ts-expect-error needs https://github.com/trpc/trpc/issues/6028
					trpc: {
						context: {
							skipBatch: true,
						},
					},
				},
			);

			if (r) {
				setDepartures(r);
			}
		}
	}, [
		currentStopPlace,
		abfahrtenFetch,
		lookahead,
		lookbehind,
		setDepartures,
		visible,
		setScrolled,
	]);
};

interface Props {
	children: ReactNode;
	abfahrtenFetch: PropsFor<typeof AbfahrtenConfigProvider>['abfahrtenFetch'];
	stopPlaceApiFunction: (searchTerm: string) => Promise<MinimalStopPlace[]>;
	urlPrefix: string;
}
export const AbfahrtenProvider: FC<Props> = ({
	children,
	abfahrtenFetch,
	stopPlaceApiFunction,
	urlPrefix,
}) => (
	<AbfahrtenConfigProvider
		urlPrefix={urlPrefix}
		abfahrtenFetch={abfahrtenFetch}
	>
		<InnerAbfahrtenProvider searchFunction={stopPlaceApiFunction}>
			{children}
		</InnerAbfahrtenProvider>
	</AbfahrtenConfigProvider>
);
