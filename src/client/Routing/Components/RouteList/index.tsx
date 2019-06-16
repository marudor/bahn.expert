import { connect } from 'react-redux';
import { ContextType, getContextRoutes } from 'Routing/actions/routing';
import { Route as RouteType } from 'types/routing';
import { RoutingState } from 'AppState';
import Button from '@material-ui/core/Button';
import Loading from 'Common/Components/Loading';
import React, { useCallback, useState } from 'react';
import Route from './Route';
import RouteHeader from './RouteHeader';
import useStyles from './index.style';

type StateProps = {
  routes?: Array<RouteType>;
  error?: any;
};

type Props = {
  dispatch: Function;
} & StateProps;

const RouteList = ({ routes, dispatch, error }: Props) => {
  const classes = useStyles();
  const [detail, setDetail] = useState<undefined | string>();
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);
  const searchLater = useCallback(async () => {
    setLoadingLater(true);
    await dispatch(getContextRoutes(ContextType.later));
    setLoadingLater(false);
  }, [dispatch]);
  const searchBefore = useCallback(async () => {
    setLoadingEarlier(true);
    await dispatch(getContextRoutes(ContextType.earlier));
    setLoadingEarlier(false);
  }, [dispatch]);

  if (error) {
    return <div className={classes.main}>{String(error)}</div>;
  }

  if (!routes) return <Loading relative />;
  if (!routes.length) return null;

  return (
    <div className={classes.main}>
      {loadingEarlier ? (
        <Loading type={1} />
      ) : (
        <Button fullWidth variant="contained" onClick={searchBefore}>
          Früher
        </Button>
      )}
      <RouteHeader />
      {routes
        .filter(r => r.isRideable)
        .map(r => (
          <Route
            detail={detail === r.checksum}
            onClick={() =>
              setDetail(detail === r.checksum ? undefined : r.checksum)
            }
            route={r}
            key={r.checksum}
          />
        ))}
      {loadingLater ? (
        <Loading type={1} />
      ) : (
        <Button fullWidth variant="contained" onClick={searchLater}>
          Später
        </Button>
      )}
    </div>
  );
};

export default connect<StateProps, {}, {}, RoutingState>(state => ({
  routes: state.routing.routes,
  error: state.routing.error,
}))(RouteList);
