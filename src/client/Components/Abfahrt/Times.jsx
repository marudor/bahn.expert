// @flow
/* eslint no-nested-ternary: 0 */
import './Times.scss';
import * as React from 'react';
import { addMinutes, format } from 'date-fns';
import { connect } from 'react-redux';
import cc from 'classnames';
import type { Abfahrt } from 'types/abfahrten';
import type { AppState } from 'AppState';

function delayString(delay: number = 0) {
  if (delay > 0) {
    return `+${delay}`;
  }

  return `-${Math.abs(delay)}`;
}

function delayStyle(delay: number = 0) {
  return delay > 0 ? 'delayed' : 'early';
}

function getDelayTime(time: ?string, delay: ?number, isCancelled: 1 | 0, timeConfig: boolean) {
  if (!time) {
    return null;
  }
  if (timeConfig && delay) {
    const newTime = addMinutes(time, delay);

    return <span className={delayStyle(delay)}>{format(newTime, 'HH:mm')}</span>;
  }

  return <span>{format(time, 'HH:mm')}</span>;
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
|};

const Times = ({
  timeConfig,
  abfahrt: { scheduledArrival, scheduledDeparture, delayArrival, delayDeparture, isCancelled },
  detail,
}: Props) => (
  <div className={cc(['Times', { cancelled: isCancelled }])}>
    {detail ? (
      <React.Fragment>
        {scheduledArrival && (
          <div>
            <div className="Times__wrapper">
              {Boolean(delayArrival) && (
                <span className={cc([delayStyle(delayArrival), 'Times--offset'])}>{delayString(delayArrival)}</span>
              )}
              <span>
                {'An:'} {getDelayTime(scheduledArrival, delayArrival, isCancelled, timeConfig)}
              </span>
            </div>
          </div>
        )}
        {scheduledDeparture && (
          <div key="d">
            <div className="Times__wrapper">
              {Boolean(delayDeparture) && (
                <span className={cc([delayStyle(delayDeparture), 'Times--offset'])}>{delayString(delayDeparture)}</span>
              )}
              <span>
                {'Ab:'} {getDelayTime(scheduledDeparture, delayDeparture, isCancelled, timeConfig)}
              </span>
            </div>
          </div>
        )}
      </React.Fragment>
    ) : scheduledDeparture ? (
      getDelayTime(scheduledDeparture, delayDeparture, isCancelled, timeConfig)
    ) : (
      getDelayTime(scheduledArrival, delayArrival, isCancelled, timeConfig)
    )}
  </div>
);

export default connect<AppState, Function, OwnProps, StateProps>(state => ({
  timeConfig: state.config.config.time,
}))(Times);
