// @flow
import { connect } from 'react-redux';
import React from 'react';
import Route from './Route';
import RouteHeader from './RouteHeader';
import withStyles, { type StyledProps } from 'react-jss';
import type { Route as RouteType } from 'types/routing';
import type { RoutingState } from 'AppState';

type StateProps = {|
  routes: ?Array<RouteType>,
|};

type DispatchProps = {|
  dispatch: *,
|};
type OwnProps = {||};

type ReduxProps = {|
  ...OwnProps,
  ...StateProps,
  ...DispatchProps,
|};

type Props = StyledProps<ReduxProps, typeof styles>;

const RouteList = ({ routes, classes }: Props) =>
  routes ? (
    <div className={classes.main}>
      <RouteHeader />
      {routes.map(r => (
        <Route route={r} key={r.cid} />
      ))}
    </div>
  ) : null;

const styles = {
  main: {
    '& > div': {
      paddingLeft: '.2em',
      paddingRight: '.2em',
    },
  },
};

export default connect<ReduxProps, OwnProps, StateProps, _, RoutingState, _>(state => ({
  routes: state.routing.routes,
}))(withStyles(styles)(RouteList));
