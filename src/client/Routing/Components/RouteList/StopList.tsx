import { Route$Stop } from 'types/routing';
import React from 'react';
import Stop from './Stop';

type OwnProps = { stops?: Route$Stop[] };

const StopList = ({ stops }: OwnProps) =>
  stops ? (
    <div style={{ paddingLeft: '0.2em' }}>
      {stops.map(s => (
        <Stop key={s.station.id} stop={s} />
      ))}
    </div>
  ) : null;

export default StopList;
