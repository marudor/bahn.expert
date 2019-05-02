import { connect } from 'react-redux';
import { ContextType, getContextRoutes } from 'Routing/actions/routing';
import { createStyles, withStyles, WithStyles } from '@material-ui/styles';
import { Route as RouteType } from 'types/routing';
import { RoutingState } from 'AppState';
import Button from '@material-ui/core/Button';
import Loading from 'Common/Components/Loading';
import React, { useCallback, useState } from 'react';
import Route from './Route';
import RouteHeader from './RouteHeader';

type StateProps = {
  routes?: Array<RouteType>;
};

type Props = {
  dispatch: Function;
} & StateProps &
  WithStyles<typeof styles>;

const RouteList = ({ routes, classes, dispatch }: Props) => {
  const [detail, setDetail] = useState<undefined | string>();
  const [loading, setLoading] = useState<undefined | ContextType>();
  const searchLater = useCallback(async () => {
    setLoading(ContextType.later);
    await dispatch(getContextRoutes(ContextType.later));
    setLoading(undefined);
  }, [dispatch]);
  const searchBefore = useCallback(async () => {
    setLoading(ContextType.earlier);
    await dispatch(getContextRoutes(ContextType.earlier));
    setLoading(undefined);
  }, [dispatch]);

  if (!routes) return <Loading />;
  if (!routes.length) return null;

  return (
    <div className={classes.main}>
      {loading === ContextType.earlier ? (
        <Loading type={1} />
      ) : (
        <Button fullWidth variant="contained" onClick={searchBefore}>
          Früher
        </Button>
      )}
      <RouteHeader />
      {routes.map(r => (
        <Route
          detail={detail === r.checksum}
          onClick={() =>
            setDetail(detail === r.checksum ? undefined : r.checksum)
          }
          route={r}
          key={r.checksum}
        />
      ))}
      {loading === ContextType.later ? (
        <Loading type={1} />
      ) : (
        <Button fullWidth variant="contained" onClick={searchLater}>
          Später
        </Button>
      )}
    </div>
  );
};

const styles = createStyles({
  main: {
    '& > div': {
      paddingLeft: '.1em',
      paddingRight: '.5em',
    },
  },
});

export default connect<StateProps, {}, {}, RoutingState>(state => ({
  routes: state.routing.routes,
}))(withStyles(styles)(RouteList));
