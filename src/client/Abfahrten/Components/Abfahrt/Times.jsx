// @flow
/* eslint no-nested-ternary: 0 */
import * as React from 'react';
import { connect } from 'react-redux';
import { delayTime } from 'client/util/delay';
import cc from 'classnames';
import styles from './Times.styles';
import withStyles, { type StyledProps } from 'react-jss';
import type { Abfahrt } from 'types/abfahrten';
import type { AbfahrtenState } from 'AppState';

type StateProps = {|
  +timeConfig: boolean,
|};
type OwnProps = {|
  +abfahrt: Abfahrt,
  +detail: boolean,
|};
export type ReduxProps = {|
  ...StateProps,
  ...OwnProps,
  +dispatch: Dispatch<>,
|};

type Props = StyledProps<ReduxProps, typeof styles>;

const Times = ({
  timeConfig,
  abfahrt: {
    scheduledArrival,
    scheduledDeparture,
    delayArrival,
    delayDeparture,
    isCancelled,
    arrivalIsCancelled,
    departureIsCancelled,
  },
  detail,
  classes,
}: Props) => (
  <div
    className={cc({
      [classes.cancelled]: isCancelled,
    })}
  >
    {detail ? (
      <React.Fragment>
        {scheduledArrival && (
          <div
            className={cc(classes.wrapper, {
              [classes.cancelled]: arrivalIsCancelled,
            })}
          >
            <span>{'An: '}</span>
            {delayTime(classes, scheduledArrival, delayArrival, timeConfig)}
          </div>
        )}
        {scheduledDeparture && (
          <div
            className={cc(classes.wrapper, {
              [classes.cancelled]: departureIsCancelled,
            })}
          >
            <span>{'Ab: '}</span>
            {delayTime(classes, scheduledDeparture, delayDeparture, timeConfig)}
          </div>
        )}
      </React.Fragment>
    ) : scheduledDeparture && (!departureIsCancelled || isCancelled) ? (
      delayTime(classes, scheduledDeparture, delayDeparture, timeConfig)
    ) : (
      delayTime(classes, scheduledArrival, delayArrival, timeConfig)
    )}
  </div>
);

export default connect<ReduxProps, OwnProps, StateProps, _, AbfahrtenState, _>(state => ({
  timeConfig: state.config.config.time,
}))(withStyles(styles)(Times));
