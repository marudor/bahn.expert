// @flow
import './index.scss';
import { type Abfahrt as AbfahrtType } from 'types/abfahrten';
import { Actions } from 'client/actions/abfahrten';
import { connect } from 'react-redux';
import End from './End';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Reihung from './Reihung';
import Start from './Start';
import type { AppState } from 'AppState';

type OwnProps = {|
  abfahrt: AbfahrtType,
  detail: boolean,
|};
type DispatchProps = {|
  setDetail: typeof Actions.setDetail,
|};
type Props = {|
  ...OwnProps,
  ...DispatchProps,
|};

class Abfahrt extends React.PureComponent<Props> {
  setDetail = () => {
    this.props.setDetail(this.props.abfahrt.id);
  };
  render() {
    const { abfahrt, detail } = this.props;

    return (
      <Paper id={abfahrt.id} onClick={this.setDetail} className="Abfahrt">
        <div className="Abfahrt__entry">
          <div className="Abfahrt__entry__main">
            <Start abfahrt={abfahrt} detail={detail} />
            <Mid abfahrt={abfahrt} detail={detail} />
            <End abfahrt={abfahrt} detail={detail} />
          </div>
          {detail && abfahrt.longDistance && <Reihung abfahrt={abfahrt} />}
        </div>
      </Paper>
    );
  }
}

export default connect<AppState, Function, OwnProps, void, DispatchProps>(
  undefined,
  {
    setDetail: Actions.setDetail,
  }
)(Abfahrt);
