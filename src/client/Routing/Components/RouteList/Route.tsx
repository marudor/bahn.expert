import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { formatDuration } from 'Routing/util';
import { Route as RouteType } from 'types/routing';
import cc from 'classnames';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Paper from '@material-ui/core/Paper';
import React, { SyntheticEvent, useMemo } from 'react';
import RouteSegments from './RouteSegments';
import Time from 'Common/Components/Time';

type OwnProps = {
  route: RouteType;
  detail: boolean;
  onClick: (e: SyntheticEvent) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Route = ({ route, classes, detail, onClick }: Props) => {
  const segmentTypes = useMemo(() => {
    if (route.segmentTypes.length > 1) return route.segmentTypes.join(' - ');

    return route.segments[0].train;
  }, [route]);

  return (
    <Paper onClick={onClick} square className={cc(classes.main)}>
      <Time
        className={classes.time}
        real={route.departure}
        delay={route.departureDelay}
      />
      <Time
        className={classes.time}
        real={route.arrival}
        delay={route.arrivalDelay}
      />
      <span>{formatDuration(route.duration)}</span>
      <span>{route.changes}</span>
      {detail ? (
        <RouteSegments className={classes.detail} segments={route.segments} />
      ) : (
        <span className={classes.products}>{segmentTypes}</span>
      )}
    </Paper>
  );
};

export const gridStyle = {
  gridTemplateColumns: '2fr 2fr 2fr 1fr',
  display: 'grid',
  marginBottom: '.2em',
};
const styles = createStyles(theme => ({
  main: {
    minHeight: '3em',
    gridTemplateRows: '2.5em 1fr',
    alignItems: 'center',
    ...gridStyle,
  },

  products: {
    fontSize: '.9em',
    gridArea: '2 / 1 / 3 / 5',
  },

  detail: {
    textDecoration: 'initial',
    overflow: 'hidden',
    gridArea: '3 / 1 / 4 / 5',
  },

  time: {
    '& > span': {
      marginRight: '.2em',
    },
  }
}));

export default withStyles(styles, { withTheme: true })(Route);
