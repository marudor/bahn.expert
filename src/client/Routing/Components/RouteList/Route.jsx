// @flow
import { connect } from 'react-redux';
import { formatDuration } from 'Routing/util';
import { getDetailForRoute } from 'Routing/selector/routing';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import RouteSegments from './RouteSegments';
import RoutingActions from 'Routing/actions/routing';
import Time from 'Common/Components/Time';
import withStyles, { type StyledProps } from 'react-jss';
import type { Route as RouteType } from 'types/routing';
import type { RoutingState } from 'AppState';

type DispatchProps = {|
  setDetail: typeof RoutingActions.setDetail,
|};
type OwnProps = {|
  route: RouteType,
|};
type StateProps = {|
  detail: boolean,
|};
type ReduxProps = {|
  ...DispatchProps,
  ...OwnProps,
  ...StateProps,
|};
type Props = StyledProps<ReduxProps, typeof styles>;

class Route extends React.PureComponent<Props> {
  getSegmentTypes() {
    const { route } = this.props;

    if (route.segmentTypes.length > 1) return route.segmentTypes.join(' - ');

    return route.segments[0].train;
  }
  setDetail = () => {
    const { setDetail, route, detail } = this.props;

    setDetail(detail ? undefined : route.cid);
  };
  render() {
    const { classes, route, detail } = this.props;

    return (
      <Paper onClick={this.setDetail} square className={classes.main}>
        <Time className={classes.time} real={route.departure} delay={route.departureDelay} />
        <Time className={classes.time} real={route.arrival} delay={route.arrivalDelay} />
        <span>{formatDuration(route.duration)}</span>
        <span>{route.changes}</span>
        <span className={classes.products}>{this.getSegmentTypes()}</span>
        {detail && <RouteSegments className={classes.detail} segments={route.segments} />}
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
    gridTemplateRows: '2.5em 1.5em auto',
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

export default connect<ReduxProps, OwnProps, StateProps, DispatchProps, RoutingState, _>(
  (state, props) => ({
    detail: getDetailForRoute(state, props),
  }),
  {
    setDetail: RoutingActions.setDetail,
  }
)(withStyles(styles)(Route));
