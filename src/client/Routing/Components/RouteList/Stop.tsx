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
  const platforms = stop.departurePlatform
    ? {
        real: stop.departurePlatform,
        scheduled: stop.scheduledDeparturePlatform,
      }
    : {
        real: stop.arrivalPlatform,
        scheduled: stop.scheduledArrivalPlatform,
      };

  return (
    <div className={classes.main}>
      <Time oneLine real={stop.arrival} delay={stop.arrivalDelay} />
      <span className={classes.station}>{stop.station.title}</span>
      <Time oneLine real={stop.departure} delay={stop.departureDelay} />
      <Platform className={classes.platform} {...platforms} />
    </div>
  );
};

export default Stop;
