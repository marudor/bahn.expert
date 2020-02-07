import MapContainer from 'client/Map/container/MapContainer';
import Position from 'client/Map/Components/Position';
import React from 'react';

const Positions = () => {
  const { positions } = MapContainer.useContainer();

  if (positions) {
    return (
      <>
        {positions.map(p => (
          <Position key={p.jid} journey={p} />
        ))}
      </>
    );
  }

  return null;
};

export default Positions;
