import { Position } from 'client/Map/Components/Position';
import { useMapProvider } from 'client/Map/provider/MapProvider';

export const Positions = () => {
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
