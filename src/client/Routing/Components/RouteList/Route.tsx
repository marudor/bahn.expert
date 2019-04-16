import { formatDuration } from 'Routing/util';
import { Route as RouteType } from 'types/routing';
import Paper from '@material-ui/core/Paper';
import React, { SyntheticEvent } from 'react';
import RouteSegments from './RouteSegments';
import Time from 'Common/Components/Time';
import withStyles, { WithStyles } from 'react-jss';

type OwnProps = {
  route: RouteType;
  detail: boolean;
  onClick: (e: SyntheticEvent) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

class Route extends React.PureComponent<Props> {
  getSegmentTypes() {
    const { route } = this.props;

    if (route.segmentTypes.length > 1) return route.segmentTypes.join(' - ');

    return route.segments[0].train;
  }
  render() {
    const { classes, route, detail, onClick } = this.props;

    return (
      <Paper onClick={onClick} square className={classes.main}>
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
          <span className={classes.products}>{this.getSegmentTypes()}</span>
        )}
      </Paper>
    );
  }
}

export const gridStyle = {
  gridTemplateColumns: '2fr 2fr 2fr 1fr',
  display: 'grid',
  marginBottom: '.2em',
};
const styles = {
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
    gridArea: '3 / 1 / 4 / 5',
  },
  time: {
    '& > span': {
      marginRight: '.2em',
    },
  },
};

export default withStyles(styles)(Route);
