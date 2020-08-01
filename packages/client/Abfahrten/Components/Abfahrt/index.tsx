import { BaseAbfahrt } from './BaseAbfahrt';
import { useMemo } from 'react';
import { useWings } from 'client/Abfahrten/container/AbfahrtenContainer/useWings';
import type { Abfahrt as AbfahrtType } from 'types/iris';

interface Props {
  abfahrt: AbfahrtType;
}

export const Abfahrt = ({ abfahrt }: Props) => {
  const wings = useWings(abfahrt);

  const sameTrainWing = useMemo(
    () =>
      Boolean(
        wings?.every(
          (w) =>
            w.train.number.endsWith(abfahrt.train.number) &&
            w.train.type !== abfahrt.train.type
        )
      ),
    [abfahrt.train.number, abfahrt.train.type, wings]
  );

  const wingNumbers = useMemo(
    () =>
      wings?.length
        ? wings.map((w) => w.train.number).concat([abfahrt.train.number])
        : undefined,
    [abfahrt.train.number, wings]
  );

  return (
    <>
      <BaseAbfahrt
        abfahrt={abfahrt}
        sameTrainWing={sameTrainWing}
        wingNumbers={wingNumbers}
        wingStart={Boolean(wingNumbers)}
      />
      {wings &&
        wings.map((w, index) => (
          <BaseAbfahrt
            sameTrainWing={sameTrainWing}
            abfahrt={w}
            key={w.rawId}
            wingNumbers={wingNumbers}
            wingEnd={wings.length === index + 1}
          />
        ))}
    </>
  );
};
