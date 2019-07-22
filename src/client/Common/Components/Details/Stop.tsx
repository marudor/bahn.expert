import { ParsedProduct } from 'types/HAFAS';
import { Route$Stop } from 'types/routing';
import cc from 'classnames';
import DetailMessages from '../Messages/Detail';
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
      <span
        className={cc(classes.station, {
          [classes.cancelled]: stop.cancelled,
          [classes.additional]: stop.additional,
        })}
      >
        {stop.station.title}
      </span>
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
        {showWR && (depOrArrival && depOrArrival.reihung) && showWR.number && (
          <Reihung
            useZoom
            trainNumber={showWR.number}
            currentStation={stop.station.title}
            scheduledDeparture={depOrArrival.scheduledTime}
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
