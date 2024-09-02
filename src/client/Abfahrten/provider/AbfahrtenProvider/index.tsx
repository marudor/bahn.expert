import {
	AbfahrtenConfigProvider,
	useAbfahrtenFetch,
} from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useAuslastung } from '@/client/Abfahrten/provider/AuslastungsProvider';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import type { AbfahrtenResult } from '@/types/iris';
import type { MinimalStopPlace } from '@/types/stopPlace';
import type { PropsFor } from '@mui/system';
import type { AxiosError } from 'axios';
import constate from 'constate';
import { useCallback, useEffect, useState } from 'react';
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
interface AbfahrtenError$Default extends AxiosError {
	errorType: undefined;
	station?: string;
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
	const { fetchVRRAuslastungForEva } = useAuslastung();
	const { startTime, lookahead, lookbehind } = useCommonConfig();

	useEffect(() => {
		if (departures?.stopPlaces) {
			for (const eva of departures.stopPlaces) {
				void fetchVRRAuslastungForEva(eva);
			}
		}
	}, [fetchVRRAuslastungForEva, departures]);

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
					setDepartures(deps);
				}
			})
			.catch((e) => setError(e));
	}, [currentStopPlace, lookahead, lookbehind, startTime, abfahrtenFetch]);

	return {
		error,
		updateCurrentStopPlaceByString,
		currentStopPlace,
		setCurrentStopPlace,
		departures,
		setDepartures,
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
	(v) => v.departures,
	(v) => v.currentStopPlace,
	(v) => v.error,
	({ departures, currentStopPlace, ...r }) => r,
);

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
