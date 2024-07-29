import { useAbfahrtenFilter } from '@/client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useAbfahrtenDepartures } from '@/client/Abfahrten/provider/AbfahrtenProvider';
import type { Abfahrt } from '@/types/iris';
import { useMemo } from 'react';

export const useAbfahrten = () => {
	const departures = useAbfahrtenDepartures();
	const { onlyDepartures, productFilter } = useAbfahrtenFilter();

	return {
		filteredAbfahrten: useMemo(() => {
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

			if (filterFunctions.length) {
				const f = (a: Abfahrt) => filterFunctions.every((fn) => fn(a));

				filtered.departures = filtered.departures.filter(f);
				filtered.lookbehind = filtered.lookbehind.filter(f);
			}

			return filtered;
		}, [departures, onlyDepartures, productFilter]),
		unfilteredAbfahrten: departures,
	};
};
