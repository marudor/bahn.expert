import * as React from 'react';
import { IAbfahrt } from '../../Services/AbfahrtenService';

interface IProps {
  abfahrt: IAbfahrt;
  detail: boolean;
}

const Times = ({ abfahrt, detail }: IProps) => (
  <div style={style.time}>
    {
      detail ? [
        abfahrt.scheduledArrival && (
          <div key="a">
            An: {abfahrt.scheduledArrival}
          </div>
        ),
        abfahrt.scheduledDeparture && (
          <div key="d">
            Ab: {abfahrt.scheduledDeparture}
          </div>
        ),
      ] : <div>
          {abfahrt.scheduledDeparture || abfahrt.scheduledArrival}
        </div >
    }
  </div>
);

export default Times;

const style = { time: { fontSize: '2.4em' } };
