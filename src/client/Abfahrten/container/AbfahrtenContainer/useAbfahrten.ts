import { Abfahrt } from 'types/api/iris';
import { useMemo } from 'react';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import AbfahrtenContainer from 'Abfahrten/container/AbfahrtenContainer';

export default () => {
  const { departures } = AbfahrtenContainer.useContainer();
  const {
    onlyDepartures,
    productFilter,
  } = AbfahrtenConfigContainer.useContainer();

  return {
    filteredAbfahrten: useMemo(() => {
      if (!departures) return departures;
      const filtered = {
        lookahead: departures.lookahead,
        lookbehind: departures.lookbehind,
      };

      const filterFunctions: ((a: Abfahrt) => boolean)[] = [];

      if (productFilter.length) {
        filterFunctions.push(
          (a: Abfahrt) => !productFilter.includes(a.train.type)
        );
      }
      if (onlyDepartures) {
        filterFunctions.push((a: Abfahrt) => Boolean(a.departure));
      }

      if (filterFunctions.length) {
        const f = (a: Abfahrt) => filterFunctions.every(fn => fn(a));

        filtered.lookahead = filtered.lookahead.filter(f);
        filtered.lookbehind = filtered.lookbehind.filter(f);
      }

      return filtered;
    }, [departures, onlyDepartures, productFilter]),
    unfilteredAbfahrten: departures,
  };
};
