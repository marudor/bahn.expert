import { AbfahrtenConfigContainer } from 'client/Abfahrten/container/AbfahrtenConfigContainer';
import {
  AbfahrtenContainer,
  fetchAbfahrten,
} from 'client/Abfahrten/container/AbfahrtenContainer';
import { useCallback } from 'react';

export const useRefreshCurrent = () => {
  const { currentStation, setDepartures } = AbfahrtenContainer.useContainer();
  const {
    config: { lookahead, lookbehind },
    fetchApiUrl,
  } = AbfahrtenConfigContainer.useContainer();

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
