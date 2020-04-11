import { useCallback } from 'react';
import AbfahrtenConfigContainer from 'Abfahrten/container/AbfahrtenConfigContainer';
import AbfahrtenContainer, {
  fetchAbfahrten,
} from 'Abfahrten/container/AbfahrtenContainer';

export default () => {
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
