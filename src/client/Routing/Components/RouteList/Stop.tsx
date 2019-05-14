import { Route$Stop } from 'types/routing';
import Platform from 'Common/Components/Platform';
import React from 'react';
import Time from 'Common/Components/Time';
import useStyles from './Stop.style';

type OwnProps = {
  stop: Route$Stop;
};
type Props = OwnProps;
const Stop = ({ stop }: Props) => {
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
    <div className={classes.main}>
      {stop.arrival ? (
        <Time oneLine real={stop.arrival.time} delay={stop.arrival.delay} />
      ) : (
        <span />
      )}
      <span className={classes.station}>{stop.station.title}</span>
      {stop.departure ? (
        <Time oneLine real={stop.departure.time} delay={stop.departure.delay} />
      ) : (
        <span />
      )}
      <Platform className={classes.platform} {...platforms} />
    </div>
  );
};

export default Stop;
