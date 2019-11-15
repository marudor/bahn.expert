import { Route$Stop } from 'types/routing';
import React from 'react';
import Stop from 'Common/Components/Details/Stop';

interface Props {
  stops?: Route$Stop[];
}

const StopList = ({ stops }: Props) =>
  stops ? (
    <div style={{ paddingLeft: '0.2em' }}>
      {stops.map(s => (
        <Stop key={s.station.id} stop={s} />
      ))}
    </div>
  ) : null;

export default StopList;
