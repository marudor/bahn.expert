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
const Stop = ({ stop, classes }: Props) => (
  <div className={classes.main}>
    <Time real={stop.arrival} delay={stop.arrivalDelay} />
    <Platform
      real={stop.arrivalPlatform}
      scheduled={stop.scheduledArrivalPlatform}
    />
    <span className={classes.station}>{stop.station.title}</span>
    <Time real={stop.departure} delay={stop.departureDelay} />
    <Platform
      real={stop.departurePlatform}
      scheduled={stop.scheduledDeparturePlatform}
    />
  </div>
);

const styles = {
  main: {
    display: 'grid',
    gridTemplateColumns: '2fr 7fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '". t" ". t" ". t"',
    alignItems: 'center',
    borderBottom: '1px solid black',
  },
  station: {
    gridArea: 't',
  },
};

export default withStyles<Props>(styles)(Stop);
