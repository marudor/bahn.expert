// @flow
import { format } from 'date-fns';
import { formatDuration } from 'Routing/util';
import React from 'react';
// import RouteSegment from './RouteSegment';
import { connect } from 'react-redux';
import { delayed, early } from 'style/mixins';
import { delayString, delayStyle } from 'client/util/delay';
import { getDetailForRoute } from 'Routing/selector/routing';
import cc from 'classnames';
import Paper from '@material-ui/core/Paper';
import RoutingActions from 'Routing/actions/routing';
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
  getTime(real, delay) {
    const { classes } = this.props;

    return (
      <div className={cc(classes.time, delayStyle(classes, delay))}>
        <span>{format(real, 'HH:mm')}</span>
        {Boolean(delay) && `(${delayString(delay)})`}
      </div>
    );
  }
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
    const { classes, route } = this.props;

    return (
      <Paper onClick={this.setDetail} square className={classes.main}>
        {this.getTime(route.departure, route.departureDelay)}
        {this.getTime(route.arrival, route.arrivalDelay)}
        <span>{formatDuration(route.duration)}</span>
        <span>{route.changes}</span>
        <span>{this.getSegmentTypes()}</span>
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
    height: '3em',
    gridTemplateRows: '1fr 1fr',
    alignItems: 'center',
    ...gridStyle,
  },
  products: {
    fontSize: '.9em',
    gridArea: '2 / 1 / 3 / 3',
  },
  time: {
    '& > span': {
      marginRight: '.2em',
    },
  },
  delayed,
  early,
};

export default connect<ReduxProps, OwnProps, StateProps, DispatchProps, RoutingState, _>(
  (state, props) => ({
    detail: getDetailForRoute(state, props),
  }),
  {
    setDetail: RoutingActions.setDetail,
  }
)(withStyles(styles)(Route));
