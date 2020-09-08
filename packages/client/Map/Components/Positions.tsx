import { Position } from 'client/Map/Components/Position';
import { useMapProvider } from 'client/Map/provider/MapProvider';
import type { FC } from 'react';

export const Positions: FC = () => {
  const { positions } = useMapProvider();

  if (positions) {
    return (
      <>
        {positions.map((p) => (
          <Position key={p.jid} journey={p} />
        ))}
      </>
    );
  }

  return null;
};
