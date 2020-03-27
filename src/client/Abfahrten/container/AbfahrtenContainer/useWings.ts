import { Abfahrt } from 'types/iris';
import { useMemo } from 'react';
import AbfahrtenContainer from 'Abfahrten/container/AbfahrtenContainer';

export default (abfahrt: Abfahrt) => {
  const { departures } = AbfahrtenContainer.useContainer();
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
