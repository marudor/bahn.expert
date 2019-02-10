// @flow
import { connect } from 'react-redux';
import { getWingsForAbfahrt } from 'client/selector/abfahrten';
import BaseAbfahrt from './BaseAbfahrt';
import React from 'react';
import type { Abfahrt as AbfahrtType, ResolvedWings } from 'types/abfahrten';
import type { AppState } from 'AppState';
export type OwnProps = {|
  abfahrt: AbfahrtType,
|};
type StateProps = {|
  resolvedWings: ?ResolvedWings,
|};
type Props = {|
  ...OwnProps,
  ...StateProps,
|};

class Abfahrt extends React.PureComponent<Props> {
  render() {
    const { resolvedWings, abfahrt } = this.props;

    const wings = resolvedWings?.arrivalWings || resolvedWings?.departureWings;

    return (
      <>
        <BaseAbfahrt abfahrt={abfahrt} wing={Boolean(wings?.length)} wingStart={Boolean(wings)} />
        {wings &&
          wings.map((w, index) => <BaseAbfahrt abfahrt={w} key={w.rawId} wing wingEnd={wings.length === index + 1} />)}
      </>
    );
  }
}

export default connect<AppState, Function, OwnProps, StateProps>((state, props) => ({
  resolvedWings: getWingsForAbfahrt(state, props),
}))(Abfahrt);
