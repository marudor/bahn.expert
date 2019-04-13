// @flow
import React from 'react';
import Stop from './Stop';
import type { Route$Stop } from 'types/routing';

type OwnProps = {| stops?: Route$Stop[] |};

const StopList = ({ stops }: OwnProps) =>
  stops ? (
    <div style={{ paddingLeft: '0.4em' }}>
      {stops.map(s => (
        <Stop key={s.station.id} stop={s} />
      ))}
    </div>
  ) : null;

export default StopList;
