import { BaseAbfahrt } from './BaseAbfahrt';
import { useMemo } from 'react';
import { useSelectedDetail } from '@/client/Abfahrten/provider/SelectedDetailProvider';
import { useWings } from '@/client/Abfahrten/provider/AbfahrtenProvider/hooks';
import type { Abfahrt as AbfahrtType } from '@/types/iris';
import type { FC } from 'react';

interface Props {
  abfahrt: AbfahrtType;
}

export const Abfahrt: FC<Props> = ({ abfahrt }) => {
  const selectedDetail = useSelectedDetail();
  const wings = useWings(abfahrt);

  const sameTrainWing = useMemo(
    () =>
      Boolean(
        wings?.every(
          (w) =>
            w.train.number.endsWith(abfahrt.train.number) &&
            w.train.type !== abfahrt.train.type,
        ),
      ),
    [abfahrt.train.number, abfahrt.train.type, wings],
  );

  const wingTrains = useMemo(
    () =>
      wings?.length ? [...wings.map((w) => w.train), abfahrt.train] : undefined,
    [abfahrt.train, wings],
  );

  return (
    <>
      <BaseAbfahrt
        detail={abfahrt.id === selectedDetail}
        abfahrt={abfahrt}
        sameTrainWing={sameTrainWing}
        wings={wingTrains}
        wingStart={Boolean(wingTrains)}
      />
      {wings?.map((w, index) => (
        <BaseAbfahrt
          detail={w.id === selectedDetail}
          sameTrainWing={sameTrainWing}
          abfahrt={w}
          key={w.rawId}
          wings={wingTrains}
          wingEnd={wings.length === index + 1}
        />
      ))}
    </>
  );
};
