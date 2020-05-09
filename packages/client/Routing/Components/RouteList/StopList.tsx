import Stop from 'client/Common/Components/Details/Stop';
import type { Route$Stop } from 'types/routing';

interface Props {
  stops?: Route$Stop[];
}

const StopList = ({ stops }: Props) =>
  stops ? (
    <div style={{ paddingLeft: '0.2em' }}>
      {stops.map((s) => (
        <Stop key={s.station.id} stop={s} />
      ))}
    </div>
  ) : null;

export default StopList;
