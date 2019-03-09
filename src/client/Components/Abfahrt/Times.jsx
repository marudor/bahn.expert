// @flow
/* eslint no-nested-ternary: 0 */
import './Times.scss';
import * as React from 'react';
import { addMinutes, format } from 'date-fns';
import { connect } from 'react-redux';
import cc from 'classnames';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState, Dispatch } from 'AppState';

function delayString(delay: number = 0) {
  if (delay > 0) {
    return `+${delay}`;
  }

  return `-${Math.abs(delay)}`;
}

function delayStyle(delay: number = 0) {
  return delay > 0 ? 'delayed' : 'early';
}

function getDelayTime(rawTime: ?number, delay: ?number, timeConfig: boolean) {
  if (!rawTime) {
    return null;
  }
  const time = timeConfig && delay ? addMinutes(rawTime, delay) : rawTime;

  return format(time, 'HH:mm');
}

type StateProps = {|
  timeConfig: boolean,
|};
type OwnProps = {|
  abfahrt: Abfahrt,
  detail: boolean,
|};
type Props = {|
  ...StateProps,
  ...OwnProps,
  dispatch: Dispatch,
|};

const Times = ({
  timeConfig,
  abfahrt: { scheduledArrival, scheduledDeparture, delayArrival, delayDeparture, isCancelled },
  detail,
}: Props) => (
  <div
    className={cc([
      'Times',
      {
        cancelled: isCancelled,
        [delayStyle(scheduledDeparture ? delayDeparture : delayArrival)]:
          !detail && (scheduledDeparture ? delayDeparture : delayArrival),
      },
    ])}
  >
    {detail ? (
      <React.Fragment>
        {scheduledArrival && (
          <div
            className={cc('Times__wrapper', {
              [delayStyle(delayArrival)]: delayArrival,
            })}
          >
            {Boolean(delayArrival) && delayString(delayArrival)}
            <span>{'  An: '}</span>
            {getDelayTime(scheduledArrival, delayArrival, timeConfig)}
          </div>
        )}
        {scheduledDeparture && (
          <div
            className={cc('Times__wrapper', {
              [delayStyle(delayDeparture)]: delayDeparture,
            })}
          >
            {Boolean(delayDeparture) && delayString(delayDeparture)}
            <span>{'  Ab: '}</span>
            {getDelayTime(scheduledDeparture, delayDeparture, timeConfig)}
          </div>
        )}
      </React.Fragment>
    ) : scheduledDeparture ? (
      getDelayTime(scheduledDeparture, delayDeparture, timeConfig)
    ) : (
      getDelayTime(scheduledArrival, delayArrival, timeConfig)
    )}
  </div>
);

export default connect<Props, OwnProps, StateProps, _, AppState, _>(state => ({
  timeConfig: state.config.config.time,
}))(Times);
