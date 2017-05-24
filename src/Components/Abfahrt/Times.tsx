import * as React from 'react';
import { IAbfahrt } from '../../Services/AbfahrtenService';

interface IProps {
  abfahrt: IAbfahrt;
  detail: boolean;
}

function delayString(delay: number) {
  if (delay > 0) {
    return `+${delay}`;
  } else {
    return `-${Math.abs(delay)}`;
  }
}

function delayStyle(delay: number) {
  return delay > 0 ? style.delay : style.early;
}

const Times = ({ abfahrt, detail }: IProps) => (
  <div style={style.time}>
    {
      detail ? [
        abfahrt.scheduledArrival && (
          <div key="a">
            <div>
              {Boolean(abfahrt.delayArrival) && (
                <span style={delayStyle(abfahrt.delayArrival)}>{delayString(abfahrt.delayArrival)}</span>
              )}
              <span>An: {abfahrt.scheduledArrival}</span>
            </div>
          </div>
        ),
        abfahrt.scheduledDeparture && (
          <div key="d">
            <div>
              {Boolean(abfahrt.delayDeparture) && (
                <span style={delayStyle(abfahrt.delayDeparture)}>{delayString(abfahrt.delayDeparture)}</span>
              )}
              <span>Ab: {abfahrt.scheduledDeparture}</span>
            </div>
          </div>
        ),
      ] : <div>
          {abfahrt.scheduledDeparture || abfahrt.scheduledArrival}
        </div >
    }
  </div>
);

export default Times;

const style = {
  time: { fontSize: '2.4em' },
  early: { color: 'green', marginRight: '0.4em' },
  delay: { color: 'red', marginRight: '0.4em' },
};
