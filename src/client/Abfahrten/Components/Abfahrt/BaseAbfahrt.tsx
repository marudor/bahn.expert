import { Abfahrt } from 'types/abfahrten';
import { AbfahrtenState } from 'AppState';
import { connect, ResolveThunks } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { getDetailForAbfahrt } from 'Abfahrten/selector/abfahrten';
import { setDetail } from 'Abfahrten/actions/abfahrten';
import cc from 'classnames';
import End from './End';
import Mid from './Mid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Reihung from './Reihung';
import Start from './Start';
import styles from './BaseAbfahrt.styles';

export type OwnProps = {
  abfahrt: Abfahrt;
  sameTrainWing: boolean;
  wing: boolean;
  wingEnd?: boolean;
  wingStart?: boolean;
};
type StateProps = {
  detail: boolean;
  lineAndNumber: boolean;
};
type DispatchProps = ResolveThunks<{
  setDetail: typeof setDetail;
}>;
export type ReduxProps = OwnProps & StateProps & DispatchProps;

export type Props = ReduxProps & WithStyles<typeof styles>;

function scrollToDetail(selectedDetail: string) {
  if (selectedDetail) {
    const detailDom = document.getElementById(selectedDetail);

    if (detailDom) {
      const scrollIntoView = () =>
        setTimeout(() => detailDom.scrollIntoView(false));

      if (document.readyState === 'complete') {
        scrollIntoView();
      } else {
        window.addEventListener('load', scrollIntoView);
      }
    }
  }
}

class BaseAbfahrt extends React.PureComponent<Props> {
  // componentDidMount() {
  //   const { detail, abfahrt } = this.props;

  //   if (detail) scrollToDetail(abfahrt.id);
  // }
  setDetail = () => {
    this.props.setDetail(this.props.abfahrt.id);
  };
  render() {
    const {
      abfahrt,
      detail,
      wing,
      wingEnd,
      wingStart,
      lineAndNumber,
      classes,
    } = this.props;

    return (
      <Paper
        square
        id={abfahrt.id}
        onClick={this.setDetail}
        className={classes.main}
      >
        {wing && (
          <span
            className={cc(classes.wing, {
              [classes.wingStart]: wingStart,
              [classes.wingEnd]: wingEnd,
            })}
          />
        )}
        <div className={classes.entry}>
          <div className={classes.entryMain}>
            <Start
              abfahrt={abfahrt}
              detail={detail}
              lineAndNumber={lineAndNumber}
            />
            <Mid abfahrt={abfahrt} detail={detail} />
            <End abfahrt={abfahrt} detail={detail} />
          </div>
          {detail && abfahrt.reihung && <Reihung abfahrt={abfahrt} />}
          {detail && (
            <div id={`${abfahrt.id}Scroll`} className={classes.scrollMarker} />
          )}
        </div>
      </Paper>
    );
  }
}

export default connect<StateProps, DispatchProps, OwnProps, AbfahrtenState>(
  (state, props) => ({
    detail: getDetailForAbfahrt(state, props),
    lineAndNumber: state.config.config.lineAndNumber,
  }),
  {
    setDetail,
  }
)(withStyles(styles)(BaseAbfahrt));
