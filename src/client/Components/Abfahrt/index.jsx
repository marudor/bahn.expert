// @flow
import './index.scss';
import { type Abfahrt as AbfahrtType } from 'types/abfahrten';
import { connect } from 'react-redux';
import { setDetail } from 'client/actions/abfahrten';
import End from './End';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Start from './Start';

type Props = {
  abfahrt: AbfahrtType,
  detail: boolean,
  setDetail: typeof setDetail,
};

class Abfahrt extends React.PureComponent<Props> {
  setDetail = () => {
    this.props.setDetail(this.props.abfahrt.id);
  };
  render() {
    const { abfahrt, detail } = this.props;

    return (
      <Paper id={abfahrt.id} onClick={this.setDetail} className="Abfahrt">
        <div className="Abfahrt__entry">
          <Start abfahrt={abfahrt} detail={detail} />
          <Mid abfahrt={abfahrt} detail={detail} />
          <End abfahrt={abfahrt} detail={detail} />
        </div>
      </Paper>
    );
  }
}

export default connect(
  null,
  {
    setDetail,
  }
)(Abfahrt);
