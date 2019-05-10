import { formatDuration } from 'Routing/util';
import { Route as RouteType } from 'types/routing';
import cc from 'classnames';
import Paper from '@material-ui/core/Paper';
import React, { SyntheticEvent, useMemo } from 'react';
import RouteSegments from './RouteSegments';
import Time from 'Common/Components/Time';
import useStyles from './Route.style';

type OwnProps = {
  route: RouteType;
  detail: boolean;
  onClick: (e: SyntheticEvent) => void;
};

type Props = OwnProps;

const Route = ({ route, detail, onClick }: Props) => {
  const classes = useStyles();
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

export default Route;
