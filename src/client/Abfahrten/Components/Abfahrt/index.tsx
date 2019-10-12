import { Abfahrt as AbfahrtType } from 'types/api/iris';
import { useAbfahrtenSelector } from 'useSelector';
import BaseAbfahrt from './BaseAbfahrt';
import React, { useMemo } from 'react';

type Props = {
  abfahrt: AbfahrtType;
};

const Abfahrt = ({ abfahrt }: Props) => {
  const wings = useAbfahrtenSelector(state => {
    const wings = state.abfahrten.wings;

    if (wings) {
      const arrivalWings = abfahrt.arrival && abfahrt.arrival.wingIds;

      if (arrivalWings) {
        return arrivalWings.map(w => wings[w]).filter(Boolean);
      }
      const departureWings = abfahrt.departure && abfahrt.departure.wingIds;

      if (departureWings) {
        return departureWings.map(w => wings[w]).filter(Boolean);
      }
    }
  });

  const sameTrainWing = useMemo(
    () =>
      Boolean(
        wings &&
          wings.every(
            w =>
              w.train.number.endsWith(abfahrt.train.number) &&
              w.train.type !== abfahrt.train.type
          )
      ),
    [abfahrt.train.number, abfahrt.train.type, wings]
  );

  return (
    <>
      <BaseAbfahrt
        abfahrt={abfahrt}
        sameTrainWing={sameTrainWing}
        wing={Boolean(wings && wings.length)}
        wingStart={Boolean(wings)}
      />
      {wings &&
        wings.map((w, index) => (
          <BaseAbfahrt
            sameTrainWing={sameTrainWing}
            abfahrt={w}
            key={w.rawId}
            wing
            wingEnd={wings.length === index + 1}
          />
        ))}
    </>
  );
};

export default Abfahrt;
