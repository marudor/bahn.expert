import Button from '@material-ui/core/Button';
import Loading from 'Common/Components/Loading';
import React, { useCallback, useState } from 'react';
import Route from './Route';
import RouteFavList from 'Routing/Components/RouteFavList';
import RouteHeader from './RouteHeader';
import RoutingContainer from 'Routing/container/RoutingContainer';
import useFetchRouting from 'Routing/container/RoutingContainer/useFetchRouting';
import useStyles from './index.style';

const translateError = (e: any) => {
  if (e && e.response && e.response.data) {
    switch (e.response.data.errorCode) {
      case 'H9380':
        return 'Du bist schon da. Hör auf zu suchen!';
      default:
        return `${e} (Hafas Code: ${e.response.data.errorCode})`;
    }
  }

  return String(e);
};

const RouteList = () => {
  const classes = useStyles();
  const {
    routes,
    error,
    earlierContext,
    laterContext,
  } = RoutingContainer.useContainer();
  const { fetchContext } = useFetchRouting();
  const [detail, setDetail] = useState<undefined | string>();
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);
  const searchLater = useCallback(async () => {
    setLoadingLater(true);
    await fetchContext('later');
    setLoadingLater(false);
  }, [fetchContext]);
  const searchBefore = useCallback(async () => {
    setLoadingEarlier(true);
    await fetchContext('earlier');
    setLoadingEarlier(false);
  }, [fetchContext]);

  if (error) {
    return <div className={classes.main}>{translateError(error)}</div>;
  }

  if (!routes) return <Loading relative />;
  if (!routes.length) return <RouteFavList />;

  return (
    <div className={classes.main}>
      {earlierContext &&
        (loadingEarlier ? (
          <Loading data-testid="fetchCtxEarlyLoading" type={1} />
        ) : (
          <Button
            data-testid="fetchCtxEarly"
            variant="outlined"
            onClick={searchBefore}
            color="secondary"
            className={classes.button}
          >
            Früher
          </Button>
        ))}
      {routes
        .filter(r => r.isRideable)
        .map((r, i) => {
          return (
            <React.Fragment key={r.checksum}>
              {(i === 0 || routes[i - 1].date !== r.date) && (
                <RouteHeader date={r.date} />
              )}
              <Route
                detail={detail === r.checksum}
                onClick={() =>
                  setDetail(detail === r.checksum ? undefined : r.checksum)
                }
                route={r}
              />
            </React.Fragment>
          );
        })}
      {laterContext &&
        (loadingLater ? (
          <Loading data-testid="fetchCtxLateLoading" type={1} />
        ) : (
          <Button
            data-testid="fetchCtxLate"
            variant="outlined"
            onClick={searchLater}
            color="secondary"
            className={classes.button}
          >
            Später
          </Button>
        ))}
    </div>
  );
};

export default RouteList;
