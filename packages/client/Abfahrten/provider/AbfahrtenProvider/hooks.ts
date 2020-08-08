import {
  fetchAbfahrten,
  useAbfahrtenDepartures,
  useCurrentAbfahrtenStation,
  useRawAbfahrten,
} from 'client/Abfahrten/provider/AbfahrtenProvider';
import {
  useAbfahrtenConfig,
  useAbfahrtenFetchAPIUrl,
  useAbfahrtenFilter,
} from 'client/Abfahrten/provider/AbfahrtenConfigProvider';
import { useCallback, useMemo } from 'react';
import type { Abfahrt } from 'types/iris';

export const useAbfahrten = () => {
  const departures = useAbfahrtenDepartures();
  const { onlyDepartures, productFilter } = useAbfahrtenFilter();

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
        const f = (a: Abfahrt) => filterFunctions.every((fn) => fn(a));

        filtered.lookahead = filtered.lookahead.filter(f);
        filtered.lookbehind = filtered.lookbehind.filter(f);
      }

      return filtered;
    }, [departures, onlyDepartures, productFilter]),
    unfilteredAbfahrten: departures,
  };
};

const defaultTypes = ['ICE', 'IC', 'EC', 'RE', 'RB', 'S'];

export const useAllTrainTypes = () => {
  const departures = useAbfahrtenDepartures();

  return useMemo(() => {
    const typeSet = new Set<string>(defaultTypes);

    if (departures) {
      departures.lookahead.forEach((a) => {
        if (a.train.type) {
          typeSet.add(a.train.type);
        }
      });
      departures.lookbehind.forEach((a) => {
        if (a.train.type) {
          typeSet.add(a.train.type);
        }
      });
    }

    return Array.from(typeSet);
  }, [departures]);
};

export const useRefreshCurrent = () => {
  const { setDepartures } = useRawAbfahrten();
  const currentStation = useCurrentAbfahrtenStation();
  const { lookahead, lookbehind } = useAbfahrtenConfig();
  const fetchApiUrl = useAbfahrtenFetchAPIUrl();

  return useCallback(async () => {
    if (currentStation && currentStation.id) {
      const r = await fetchAbfahrten(
        `${fetchApiUrl}/${currentStation.id}`,
        lookahead,
        lookbehind
      );

      setDepartures({
        lookahead: r.departures,
        lookbehind: r.lookbehind,
        wings: r.wings,
      });
    }
  }, [currentStation, fetchApiUrl, lookahead, lookbehind, setDepartures]);
};

export const useWings = (abfahrt: Abfahrt) => {
  const departures = useAbfahrtenDepartures();
  const wings = departures && departures.wings;

  return useMemo(() => {
    if (wings) {
      const arrivalWings = abfahrt.arrival && abfahrt.arrival.wingIds;

      if (arrivalWings) {
        return arrivalWings.map((w) => wings[w]).filter(Boolean);
      }
      const departureWings = abfahrt.departure && abfahrt.departure.wingIds;

      if (departureWings) {
        return departureWings.map((w) => wings[w]).filter(Boolean);
      }
    }
  }, [abfahrt.arrival, abfahrt.departure, wings]);
};
