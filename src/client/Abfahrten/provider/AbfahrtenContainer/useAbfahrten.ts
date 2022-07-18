import { useAbfahrtenDepartures } from 'client/Abfahrten/provider/AbfahrtenProvider';
import { useAbfahrtenFilter } from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useMemo } from 'react';
import type { Abfahrt } from 'types/iris';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
