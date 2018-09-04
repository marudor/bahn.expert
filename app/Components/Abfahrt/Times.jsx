// @flow
/* eslint no-nested-ternary: 0 */
import './Times.scss';
import * as React from 'react';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import AbfahrtContext from './AbfahrtContext';
import cc from 'classnames';
import type { AppState } from 'AppState';

function delayString(delay: number = 0) {
  if (delay > 0) {
    return `+${delay}`;
  }

  return `-${Math.abs(delay)}`;
}

function delayStyle(delay: number = 0) {
  return delay > 0 ? 'delay' : 'early';
}

function getDelayTime(time: ?string, delay: ?number, isCancelled: 1 | 0, timeConfig: boolean) {
  if (!time) {
    return null;
  }
  if (timeConfig && delay && !isCancelled) {
    const parsedTime = DateTime.fromFormat(time, 'HH:mm');
    const newTime = parsedTime.plus({ minutes: delay }).toFormat('HH:mm');

    return <span className={delayStyle(delay)}>{newTime}</span>;
  }

  return <span>{time}</span>;
}

type Props = {
  timeConfig: boolean,
};

const Times = ({ timeConfig }: Props) => (
  <AbfahrtContext.Consumer>
    {({ abfahrt: { scheduledArrival, scheduledDeparture, delayArrival, delayDeparture, isCancelled }, detail }) => (
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
                    <span className={cc([delayStyle(delayDeparture), 'Times--offset'])}>
                      {delayString(delayDeparture)}
                    </span>
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
    )}
  </AbfahrtContext.Consumer>
);

export default connect((state: AppState) => ({
  timeConfig: state.config.time,
}))(Times);
