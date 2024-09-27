import { useAbfahrtenFetch } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import {
	useAbfahrtenDepartures,
	useCurrentAbfahrtenStopPlace,
	useRawAbfahrten,
} from '@/client/Abfahrten/provider/AbfahrtenProvider';
import { useCommonConfig } from '@/client/Common/provider/CommonConfigProvider';
import type { Abfahrt } from '@/types/iris';
import { useCallback, useMemo } from 'react';

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
