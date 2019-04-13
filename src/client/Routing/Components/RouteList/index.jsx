// @flow
import { connect } from 'react-redux';
import React, { useState } from 'react';
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

const RouteList = ({ routes, classes }: Props) => {
  const [detail, setDetail] = useState<?string>();

  if (!routes) return null;

  return (
    <div className={classes.main}>
      <RouteHeader />
      {routes.map(r => (
        <Route
          detail={detail === r.cid}
          onClick={() => setDetail(detail === r.cid ? undefined : r.cid)}
          route={r}
          key={r.cid}
        />
      ))}
    </div>
  );
};

const styles = {
  main: {
    '& > div': {
      paddingLeft: '.1em',
      paddingRight: '1em',
    },
  },
};

export default connect<ReduxProps, OwnProps, StateProps, _, RoutingState, _>(
  state => ({
    routes: state.routing.routes,
  })
)(withStyles<Props>(styles)(RouteList));
