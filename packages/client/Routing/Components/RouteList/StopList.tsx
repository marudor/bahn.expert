import { Stop } from 'client/Common/Components/Details/Stop';
import type { Route$Stop } from 'types/routing';

interface Props {
  stops?: Route$Stop[];
}

export const StopList = ({ stops }: Props) =>
  stops ? (
    <div style={{ paddingLeft: '0.2em' }}>
      {stops.map((s) => (
        <Stop key={s.station.id} stop={s} />
      ))}
    </div>
  ) : null;
