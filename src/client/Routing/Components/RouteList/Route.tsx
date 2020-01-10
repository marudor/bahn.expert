import { formatDuration } from 'Routing/util';
import { SingleRoute } from 'types/routing';
import cc from 'clsx';
import Paper from '@material-ui/core/Paper';
import React, { SyntheticEvent, useMemo } from 'react';
import RouteSegments from './RouteSegments';
import Time from 'Common/Components/Time';
import useStyles from './Route.style';

interface Props {
  route: SingleRoute;
  detail: boolean;
  onClick: (e: SyntheticEvent) => void;
}

const Route = ({ route, detail, onClick }: Props) => {
  const classes = useStyles();
  const segmentTypes = useMemo(() => {
    if (route.segmentTypes.length > 1) return route.segmentTypes.join(' - ');

    return route.segments[0]?.train.name;
  }, [route]);

  return (
    <Paper onClick={onClick} square className={cc(classes.main)}>
      <Time
        className={classes.time}
        real={route.departure.time}
        delay={route.departure.delay}
      />
      <Time
        className={classes.time}
        real={route.arrival.time}
        delay={route.arrival.delay}
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

export default Route;
