import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Route$Stop } from 'types/routing';
import Platform from 'Common/Components/Platform';
import React from 'react';
import Time from 'Common/Components/Time';

type OwnProps = {
  stop: Route$Stop;
};
type Props = OwnProps & WithStyles<typeof styles>;
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

const styles = createStyles(theme => ({
  main: {
    display: 'grid',
    gridTemplateColumns: '4em 1fr min-content',
    gridGap: '0 .3em',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: '". t p" ". t p" ". t p"',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.text.primary}`,
  },

  station: {
    gridArea: 't',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  platform: {
    gridArea: 'p',
  },
}));

export default withStyles(styles)(Stop);
