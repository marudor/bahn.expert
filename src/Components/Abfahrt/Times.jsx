// @flow
import './Times.scss';
import { type Abfahrt } from 'types/abfahrten';
import React from 'react';

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
  return delay > 0 ? 'Times--delay' : 'Times--early';
}

const Times = ({ abfahrt, detail }: Props) => (
  <div className="Times">
    {detail ? (
      [
        abfahrt.scheduledArrival && (
          <div key="a">
            <div className="Times__wrapper">
              {Boolean(abfahrt.delayArrival) && (
                <span className={delayStyle(abfahrt.delayArrival)}>{delayString(abfahrt.delayArrival)}</span>
              )}
              <span>
                {'An:'} {abfahrt.scheduledArrival}
              </span>
            </div>
          </div>
        ),
        abfahrt.scheduledDeparture && (
          <div key="d">
            <div className="Times__wrapper">
              {Boolean(abfahrt.delayDeparture) && (
                <span className={delayStyle(abfahrt.delayDeparture)}>{delayString(abfahrt.delayDeparture)}</span>
              )}
              <span>
                {'Ab:'} {abfahrt.scheduledDeparture}
              </span>
            </div>
          </div>
        ),
      ]
    ) : (
      <div>{abfahrt.scheduledDeparture || abfahrt.scheduledArrival}</div>
    )}
  </div>
);

export default Times;
