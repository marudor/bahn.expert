import { formatDuration } from 'client/Routing/util';
import { makeStyles, Paper } from '@material-ui/core';
import { PlannedType } from 'client/Common/Components/PlannedType';
import { RouteSegments } from './RouteSegments';
import { Time } from 'client/Common/Components/Time';
import { useMemo } from 'react';
import type { FC, SyntheticEvent } from 'react';
import type { SingleRoute } from 'types/routing';

interface Props {
  route: SingleRoute;
  detail: boolean;
  onClick: (e: SyntheticEvent) => void;
}

const useStyles = makeStyles({
  wrap: {
    gridTemplateColumns: '2fr 2fr 2fr 2fr',
    gridTemplateRows: '60px 20px',
    display: 'grid',
    marginBottom: '.2em',
    alignItems: 'center',
    minHeight: '3em',
  },
  time: {
    '& > span': {
      marginRight: '.2em',
    },
  },
  detailRouteSegments: {
    textDecoration: 'initial',
    overflow: 'hidden',
    gridArea: '3 / 1 / 4 / 5',
  },
  products: {
    fontSize: '.9em',
    gridArea: '2 / 1 / 3 / 5',
  },
});

export const Route: FC<Props> = ({ route, detail, onClick }) => {
  const classes = useStyles();
  const segmentTypes = useMemo(() => {
    if (route.segmentTypes.length > 1) return route.segmentTypes.join(' - ');

    const firstSegment = route.segments[0];

    if (!firstSegment) return null;

    return (
      <span>
        {firstSegment.train.name}
        {'plannedSequence' in firstSegment && (
          <PlannedType plannedSequence={firstSegment.plannedSequence} />
        )}
      </span>
    );
  }, [route]);

  return (
    <Paper
      className={classes.wrap}
      data-testid={`Route-${route.cid}`}
      onClick={onClick}
      square
    >
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
        <RouteSegments
          className={classes.detailRouteSegments}
          segments={route.segments}
        />
      ) : (
        <span className={classes.products}>{segmentTypes}</span>
      )}
    </Paper>
  );
};
