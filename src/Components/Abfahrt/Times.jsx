// @flow
/* eslint no-nested-ternary: 0 */
import './Times.scss';
import * as React from 'react';
import { type Abfahrt } from 'types/abfahrten';
import { DateTime } from 'luxon';
import cc from 'classcat';
type Props = {
  abfahrt: Abfahrt,
  detail: boolean,
};

function delayString(delay: number = 0) {
  if (delay > 0) {
    return `+${delay}`;
  }

  return `-${Math.abs(delay)}`;
}

function delayStyle(delay: number = 0) {
  return delay > 0 ? 'delay' : 'early';
}

function getDelayTime(time: ?string, delay: ?number) {
  if (!time) {
    return null;
  }
  if (delay) {
    const parsedTime = DateTime.fromFormat(time, 'hh:mm');
    const newTime = parsedTime.plus({ minutes: delay }).toFormat('hh:mm');

    return <span className={delayStyle(delay)}>{newTime}</span>;
  }

  return <span>{time}</span>;
}

const Times = ({ abfahrt: { scheduledArrival, scheduledDeparture, delayArrival, delayDeparture }, detail }: Props) => (
  <div className="Times">
    {detail ? (
      <React.Fragment>
        {scheduledArrival && (
          <div>
            <div className="Times__wrapper">
              {Boolean(delayArrival) && (
                <span className={cc([delayStyle(delayArrival), 'Times--offset'])}>{delayString(delayArrival)}</span>
              )}
              <span>
                {'An:'} {getDelayTime(scheduledArrival, delayArrival)}
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
                {'Ab:'} {getDelayTime(scheduledDeparture, delayDeparture)}
              </span>
            </div>
          </div>
        )}
      </React.Fragment>
    ) : scheduledDeparture ? (
      getDelayTime(scheduledDeparture, delayDeparture)
    ) : (
      getDelayTime(scheduledArrival, delayArrival)
    )}
  </div>
);

export default Times;
