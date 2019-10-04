import { Abfahrt } from 'types/api/iris';
import { useAbfahrtenSelector } from 'useSelector';
import { useMemo } from 'react';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';

export default () => {
  const abfahrten = useAbfahrtenSelector(state => state.abfahrten.departures);
  const {
    onlyDepartures,
    productFilter,
  } = AbfahrtenConfigContainer.useContainer();

  return {
    filteredAbfahrten: useMemo(() => {
      if (!abfahrten) return abfahrten;
      const filtered = {
        lookahead: abfahrten.lookahead,
        lookbehind: abfahrten.lookbehind,
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
    }, [abfahrten, onlyDepartures, productFilter]),
    unfilteredAbfahrten: abfahrten,
  };
};
