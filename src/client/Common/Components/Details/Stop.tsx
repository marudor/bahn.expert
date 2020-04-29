import { ParsedProduct } from 'types/HAFAS';
import { Route$Stop } from 'types/routing';
import cc from 'clsx';
import CheckInLink from 'Common/Components/CheckInLink';
import DetailMessages from '../Messages/Detail';
import Messages from './Messages';
import Platform from 'Common/Components/Platform';
import Reihung from '../Reihung';
import StationLink from 'Common/Components/StationLink';
import Time from 'Common/Components/Time';
import useStyles from './Stop.style';

interface Props {
  stop: Route$Stop;
  train?: ParsedProduct;
  showWR?: ParsedProduct;
}
const Stop = ({ stop, showWR, train }: Props) => {
  const classes = useStyles();
  const depOrArrival = stop.departure || stop.arrival;
  const platforms = stop.departure
    ? {
        real: stop.departure.platform,
        scheduled: stop.departure.scheduledPlatform,
      }
    : stop.arrival
    ? {
        real: stop.arrival.platform,
        scheduled: stop.arrival.scheduledPlatform,
      }
    : {};

  return (
    <div className={classes.main}>
      <span id={stop.station.id} className={classes.scrollMarker} />
      {stop.arrival && (
        <Time
          className={classes.arrival}
          cancelled={stop.arrival.cancelled}
          oneLine
          real={stop.arrival.time}
          delay={stop.arrival.delay}
        />
      )}
      <span
        className={cc(classes.station, {
          [classes.cancelled]: stop.cancelled,
          [classes.additional]: stop.additional,
        })}
      >
        <StationLink
          className={classes.stationName}
          stationName={stop.station.title}
        />
      </span>
      {train && (
        <CheckInLink
          className={classes.checkIn}
          station={stop.station}
          train={train}
          departure={stop.departure}
          arrival={stop.arrival}
        />
      )}
      {stop.departure && (
        <Time
          className={classes.departure}
          cancelled={stop.departure.cancelled}
          oneLine
          real={stop.departure.time}
          delay={stop.departure.delay}
        />
      )}
      {/* {stop.messages && <div>{stop.messages.map(m => m.txtN)}</div>} */}
      <Platform className={classes.platform} {...platforms} />
      <div className={classes.wr}>
        {showWR?.number && depOrArrival && (
          <Reihung
            trainNumber={showWR.number}
            currentStation={stop.station.title}
            scheduledDeparture={depOrArrival.scheduledTime}
            loadHidden={!depOrArrival?.reihung}
          />
        )}
      </div>
      <div className={classes.messages}>
        {stop.irisMessages && <DetailMessages messages={stop.irisMessages} />}
        <Messages messages={stop.messages} />
      </div>
    </div>
  );
};

export default Stop;
