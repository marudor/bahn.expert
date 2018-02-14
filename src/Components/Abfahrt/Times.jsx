// @flow
import { type Abfahrt } from 'types/abfahrten';
import React from 'react';
import styles from './Times.scss';

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
  return delay > 0 ? styles.delay : styles.early;
}

const Times = ({ abfahrt, detail }: Props) => (
  <div className={styles.time}>
    {detail ? (
      [
        abfahrt.scheduledArrival && (
          <div key="a">
            <div className={styles.timeWrapper}>
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
            <div className={styles.timeWrapper}>
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
