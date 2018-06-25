// @flow
/* eslint no-nested-ternary: 0 */
import './Times.scss';
import * as React from 'react';
import { DateTime } from 'luxon';
import AbfahrtContext from './AbfahrtContext';
import cc from 'classcat';

function delayString(delay: number = 0) {
  if (delay > 0) {
    return `+${delay}`;
  }

  return `-${Math.abs(delay)}`;
}

function delayStyle(delay: number = 0) {
  return delay > 0 ? 'delay' : 'early';
}

function getDelayTime(time: ?string, delay: ?number, isCancelled: 1 | 0) {
  if (!time) {
    return null;
  }
  if (delay && !isCancelled) {
    const parsedTime = DateTime.fromFormat(time, 'HH:mm');
    const newTime = parsedTime.plus({ minutes: delay }).toFormat('HH:mm');

    return <span className={delayStyle(delay)}>{newTime}</span>;
  }

  return <span>{time}</span>;
}

const Times = () => (
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
                    {'An:'} {getDelayTime(scheduledArrival, delayArrival, isCancelled)}
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
                    {'Ab:'} {getDelayTime(scheduledDeparture, delayDeparture, isCancelled)}
                  </span>
                </div>
              </div>
            )}
          </React.Fragment>
        ) : scheduledDeparture ? (
          getDelayTime(scheduledDeparture, delayDeparture, isCancelled)
        ) : (
          getDelayTime(scheduledArrival, delayArrival, isCancelled)
        )}
      </div>
    )}
  </AbfahrtContext.Consumer>
);

export default Times;
