import { Button, makeStyles } from '@material-ui/core';
import { Loading } from 'client/Common/Components/Loading';
import { Route } from './Route';
import { RouteFavList } from 'client/Routing/Components/RouteFavList';
import { RouteHeader } from './RouteHeader';
import { RoutingContainer } from 'client/Routing/container/RoutingContainer';
import { useCallback, useState } from 'react';
import { useFetchRouting } from 'client/Routing/container/RoutingContainer/useFetchRouting';

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

const useStyles = makeStyles({
  button: {
    height: 45,
    margin: 10,
    flex: 1,
  },
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    '& > div': {
      padding: '0 .5em 0 .1em',
    },
  },
});

export const RouteList = () => {
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
    return <div className={classes.wrap}>{translateError(error)}</div>;
  }

  if (!routes) return <Loading relative />;
  if (!routes.length) return <RouteFavList />;

  return (
    <div className={classes.wrap}>
      {earlierContext &&
        (loadingEarlier ? (
          <Loading data-testid="fetchCtxEarlyLoading" type={1} />
        ) : (
          <Button
            className={classes.button}
            data-testid="fetchCtxEarly"
            variant="outlined"
            onClick={searchBefore}
          >
            Früher
          </Button>
        ))}
      {routes
        .filter((r) => r.isRideable)
        .map((r, i) => {
          return (
            <>
              {(i === 0 || routes[i - 1].date !== r.date) && (
                <RouteHeader date={r.date} />
              )}
              <Route
                key={r.checksum}
                detail={detail === r.checksum}
                onClick={() =>
                  setDetail(detail === r.checksum ? undefined : r.checksum)
                }
                route={r}
              />
            </>
          );
        })}
      {laterContext &&
        (loadingLater ? (
          <Loading data-testid="fetchCtxLateLoading" type={1} />
        ) : (
          <Button
            className={classes.button}
            data-testid="fetchCtxLate"
            variant="outlined"
            onClick={searchLater}
          >
            Später
          </Button>
        ))}
    </div>
  );
};
