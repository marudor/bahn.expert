import { AbfahrtenContainer } from 'client/Abfahrten/container/AbfahrtenContainer';
import { useMemo } from 'react';

const defaultTypes = ['ICE', 'IC', 'EC', 'RE', 'RB', 'S'];

export const useAllTrainTypes = () => {
  const departures = AbfahrtenContainer.useContainer().departures;

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
