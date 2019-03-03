// @flow
import './BaseAbfahrt.scss';
import { connect } from 'react-redux';
import { getDetailForAbfahrt } from 'client/selector/abfahrten';
import { setDetail } from 'client/actions/abfahrten';
import cc from 'classnames';
import End from './End';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Reihung from './Reihung';
import Start from './Start';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';

export type OwnProps = {|
  abfahrt: Abfahrt,
  sameTrainWing: boolean,
  wing: boolean,
  wingEnd?: boolean,
  wingStart?: boolean,
|};
type StateProps = {|
  detail: boolean,
  lineAndNumber: boolean,
|};
type DispatchProps = {|
  setDetail: typeof setDetail,
|};
export type Props = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

function scrollToDetail(selectedDetail) {
  if (selectedDetail) {
    const detailDom = document.getElementById(selectedDetail);

    if (detailDom) {
      const scrollIntoView = () => setTimeout(() => detailDom.scrollIntoView(false));

      if (document.readyState === 'complete') {
        scrollIntoView();
      } else {
        window.addEventListener('load', scrollIntoView);
      }
    }
  }
}

class BaseAbfahrt extends React.PureComponent<Props> {
  componentDidMount() {
    const { detail, abfahrt } = this.props;

    if (detail) scrollToDetail(abfahrt.id);
  }
  setDetail = () => {
    this.props.setDetail(this.props.abfahrt.id);
  };
  render() {
    const { abfahrt, detail, wing, sameTrainWing, wingEnd, wingStart, lineAndNumber } = this.props;

    return (
      <Paper id={abfahrt.id} onClick={this.setDetail} className="Abfahrt">
        {wing && (
          <span
            className={cc(`wing`, {
              'wing--same': sameTrainWing,
              'wing--start': wingStart,
              'wing--end': wingEnd,
            })}
          />
        )}
        <div className="Abfahrt__entry">
          <div className="Abfahrt__entry__main">
            <Start abfahrt={abfahrt} detail={detail} lineAndNumber={lineAndNumber} />
            <Mid abfahrt={abfahrt} detail={detail} />
            <End abfahrt={abfahrt} detail={detail} />
          </div>
          {detail && abfahrt.reihung && <Reihung abfahrt={abfahrt} />}
        </div>
      </Paper>
    );
  }
}

export default connect<Props, OwnProps, StateProps, DispatchProps, AppState, _>(
  (state, props) => ({
    detail: getDetailForAbfahrt(state, props),
    lineAndNumber: state.config.config.lineAndNumber,
  }),
  {
    setDetail,
  }
)(BaseAbfahrt);
