// @flow
import './index.scss';
import { connect } from 'react-redux';
import { getDetailForAbfahrt, getWingsForAbfahrt } from 'client/selector/abfahrten';
import { setDetail } from 'client/actions/abfahrten';
import End from './End';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Reihung from './Reihung';
import Start from './Start';
import type { Abfahrt as AbfahrtType, ResolvedWings } from 'types/abfahrten';
import type { AppState } from 'AppState';

export type OwnProps = {|
  abfahrt: AbfahrtType,
  wing?: number,
|};
type StateProps = {|
  resolvedWings: ?ResolvedWings,
  detail: boolean,
|};
type DispatchProps = {|
  setDetail: typeof setDetail,
|};
type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

class Abfahrt extends React.PureComponent<Props> {
  setDetail = () => {
    this.props.setDetail(this.props.abfahrt.id);
  };
  render() {
    const { abfahrt, detail, resolvedWings, wing } = this.props;

    const wings = resolvedWings?.arrivalWings || resolvedWings?.departureWings;
    const hasWings = Boolean(wings?.length);

    return (
      <>
        <Paper id={abfahrt.id} onClick={this.setDetail} className="Abfahrt">
          {(hasWings || wing) && <span className={`wing${wing || 0}`} />}
          <div className="Abfahrt__entry">
            <div className="Abfahrt__entry__main">
              <Start abfahrt={abfahrt} detail={detail} />
              <Mid abfahrt={abfahrt} detail={detail} />
              <End abfahrt={abfahrt} detail={detail} />
            </div>
            {detail && abfahrt.reihung && <Reihung abfahrt={abfahrt} />}
          </div>
        </Paper>
        {wings && wings.map((a, index) => <ConnectedAbfahrt key={a.rawId} abfahrt={a} wing={index + 1} />)}
      </>
    );
  }
}

const ConnectedAbfahrt = connect<AppState, Function, OwnProps, StateProps, DispatchProps>(
  (state, props) => ({
    resolvedWings: getWingsForAbfahrt(state, props),
    detail: getDetailForAbfahrt(state, props),
  }),
  {
    setDetail,
  }
)(Abfahrt);

export default ConnectedAbfahrt;
