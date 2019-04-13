// @flow
import Platform from 'Common/Components/Platform';
import React from 'react';
import Time from 'Common/Components/Time';
import withStyles, { type StyledProps } from 'react-jss';
import type { Route$Stop } from 'types/routing';

type OwnProps = {|
  stop: Route$Stop,
|};
type Props = StyledProps<OwnProps, typeof styles>;
const Stop = ({ stop, classes }: Props) => {
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

const styles = {
  main: {
    display: 'grid',
    gridTemplateColumns: '5em 1fr min-content',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '". t p" ". t p" ". t p"',
    alignItems: 'center',
    borderBottom: '1px solid black',
  },
  station: {
    gridArea: 't',
  },
  platform: {
    gridArea: 'p',
  },
};

export default withStyles<Props>(styles)(Stop);
