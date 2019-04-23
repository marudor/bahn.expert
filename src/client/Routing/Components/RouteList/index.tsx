import { connect } from 'react-redux';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Route as RouteType } from 'types/routing';
import { RoutingState } from 'AppState';
import Loading from 'Common/Components/Loading';
import React, { useState } from 'react';
import Route from './Route';
import RouteHeader from './RouteHeader';

type StateProps = {
  routes?: Array<RouteType>;
};

type Props = StateProps & WithStyles<typeof styles>;

const RouteList = ({ routes, classes }: Props) => {
  const [detail, setDetail] = useState<undefined | string>();

  if (!routes) return <Loading />;
  if (!routes.length) return null;

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

const styles = createStyles({
  main: {
    '& > div': {
      paddingLeft: '.1em',
      paddingRight: '1em',
    },
  },
});

export default connect<StateProps, {}, {}, RoutingState>(state => ({
  routes: state.routing.routes,
}))(withStyles(styles)(RouteList));
