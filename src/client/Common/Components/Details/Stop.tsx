import { ParsedProduct } from 'types/HAFAS';
import { Route$Stop } from 'types/routing';
import cc from 'classnames';
import Messages from './Messages';
import Platform from 'Common/Components/Platform';
import React from 'react';
import Reihung from '../Reihung';
import Time from 'Common/Components/Time';
import useStyles from './Stop.style';

type OwnProps = {
  stop: Route$Stop;
  showWR?: ParsedProduct;
};
type Props = OwnProps;
const Stop = ({ stop, showWR }: Props) => {
  const classes = useStyles();
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
    <div
      className={cc(classes.main, {
        [classes.cancelled]: stop.cancelled,
      })}
    >
      <span id={stop.station.id} className={classes.scrollMarker} />
      {stop.arrival ? (
        <Time
          cancelled={stop.arrival.cancelled}
          oneLine
          real={stop.arrival.time}
          delay={stop.arrival.delay}
        />
      ) : (
        <span />
      )}
      <span className={classes.station}>{stop.station.title}</span>
      {stop.departure ? (
        <Time
          cancelled={stop.departure.cancelled}
          oneLine
          real={stop.departure.time}
          delay={stop.departure.delay}
        />
      ) : (
        <span />
      )}
      {/* {stop.messages && <div>{stop.messages.map(m => m.txtN)}</div>} */}
      <Platform className={classes.platform} {...platforms} />
      <div className={classes.wr}>
        {showWR &&
          stop.departure &&
          stop.departure.reihung &&
          showWR.number && (
            <Reihung
              useZoom
              trainNumber={showWR.number}
              currentStation={stop.station.title}
              scheduledDeparture={stop.departure.scheduledTime}
            />
          )}
      </div>
      <div className={classes.messages}>
        <Messages messages={stop.messages} />
      </div>
    </div>
  );
};

export default Stop;
