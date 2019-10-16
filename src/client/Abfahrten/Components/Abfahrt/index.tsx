import { Abfahrt as AbfahrtType } from 'types/api/iris';
import BaseAbfahrt from './BaseAbfahrt';
import React, { useMemo } from 'react';
import useWings from 'Abfahrten/container/AbfahrtenContainer/useWings';

type Props = {
  abfahrt: AbfahrtType;
};

const Abfahrt = ({ abfahrt }: Props) => {
  const wings = useWings(abfahrt);

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
