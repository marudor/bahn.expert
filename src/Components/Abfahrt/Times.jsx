// @flow
import { IAbfahrt } from '../../Services/AbfahrtenService';
import React from 'react';

interface Props {
  abfahrt: IAbfahrt,
  detail: boolean,
}

function delayString(delay: number) {
  if (delay > 0) {
    return `+${delay}`;
  }
  return `-${Math.abs(delay)}`;
}

function delayStyle(delay: number) {
  return delay > 0 ? style.delay : style.early;
}

const Times = ({ abfahrt, detail }: Props) => (
  <div style={style.time}>
    {detail
      ? [
          abfahrt.scheduledArrival &&
            <div key="a">
              <div style={style.timeWrapper}>
                {Boolean(abfahrt.delayArrival) &&
                  <span style={delayStyle(abfahrt.delayArrival)}>
                    {delayString(abfahrt.delayArrival)}
                  </span>}
                <span>{'An:'} {abfahrt.scheduledArrival}</span>
              </div>
            </div>,
          abfahrt.scheduledDeparture &&
            <div key="d">
              <div style={style.timeWrapper}>
                {Boolean(abfahrt.delayDeparture) &&
                  <span style={delayStyle(abfahrt.delayDeparture)}>
                    {delayString(abfahrt.delayDeparture)}
                  </span>}
                <span>{'Ab:'} {abfahrt.scheduledDeparture}</span>
              </div>
            </div>,
        ]
      : <div>
          {abfahrt.scheduledDeparture || abfahrt.scheduledArrival}
        </div>}
  </div>
);

export default Times;

const style = {
  timeWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  time: { fontSize: '2.4em' },
  early: { color: 'green', marginRight: '0.4em' },
  delay: { color: 'red', marginRight: '0.4em' },
};
