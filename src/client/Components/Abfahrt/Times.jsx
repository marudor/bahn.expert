// @flow
/* eslint no-nested-ternary: 0 */
import * as React from 'react';
import { addMinutes, format } from 'date-fns';
import { connect } from 'react-redux';
import cc from 'classnames';
import styles from './Times.styles';
import withStyles, { type StyledProps } from 'react-jss';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState, Dispatch } from 'AppState';

function delayString(delay: number = 0) {
  if (delay > 0) {
    return `+${delay}`;
  }

  return `-${Math.abs(delay)}`;
}

function getDelayTime(rawTime: ?number, delay: ?number, timeConfig: boolean) {
  if (!rawTime) {
    return null;
  }
  const time = timeConfig && delay ? addMinutes(rawTime, delay) : rawTime;

  return format(time, 'HH:mm');
}

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
  +dispatch: Dispatch,
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
    className={cc([
      classes.main,
      {
        [classes.cancelled]: isCancelled,
      },
    ])}
  >
    {detail ? (
      <React.Fragment>
        {scheduledArrival && (
          <div
            className={cc(classes.wrapper, classes.detailAn, {
              [classes.cancelled]: arrivalIsCancelled,
            })}
          >
            {Boolean(delayArrival) && delayString(delayArrival)}
            <span>{'  An: '}</span>
            {getDelayTime(scheduledArrival, delayArrival, timeConfig)}
          </div>
        )}
        {scheduledDeparture && (
          <div
            className={cc(classes.wrapper, classes.detailAb, {
              [classes.cancelled]: departureIsCancelled,
            })}
          >
            {Boolean(delayDeparture) && delayString(delayDeparture)}
            <span>{'  Ab: '}</span>
            {getDelayTime(scheduledDeparture, delayDeparture, timeConfig)}
          </div>
        )}
      </React.Fragment>
    ) : scheduledDeparture && !departureIsCancelled ? (
      getDelayTime(scheduledDeparture, delayDeparture, timeConfig)
    ) : (
      getDelayTime(scheduledArrival, delayArrival, timeConfig)
    )}
  </div>
);

export default connect<ReduxProps, OwnProps, StateProps, _, AppState, _>(state => ({
  timeConfig: state.config.config.time,
}))(withStyles(styles)(Times));
