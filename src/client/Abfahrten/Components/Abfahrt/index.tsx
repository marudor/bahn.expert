import { AbfahrtenState } from 'AppState';
import { Abfahrt as AbfahrtType, ResolvedWings } from 'types/abfahrten';
import { connect } from 'react-redux';
import { getWingsForAbfahrt } from 'Abfahrten/selector/abfahrten';
import BaseAbfahrt from './BaseAbfahrt';
import React from 'react';

export type OwnProps = {
  abfahrt: AbfahrtType;
};
type StateProps = {
  resolvedWings?: ResolvedWings;
};
type Props = OwnProps & StateProps;

const Abfahrt = ({ resolvedWings, abfahrt }: Props) => {
  const wings = resolvedWings
    ? resolvedWings.arrivalWings || resolvedWings.departureWings
    : undefined;

  const sameTrainWing = Boolean(
    wings &&
      wings.every(
        w =>
          w.train.number.endsWith(abfahrt.train.number) &&
          w.train.type !== abfahrt.train.type
      )
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

export default connect<StateProps, void, OwnProps, AbfahrtenState>(
  (state, props) => ({
    resolvedWings: getWingsForAbfahrt(state, props),
  })
)(Abfahrt);
