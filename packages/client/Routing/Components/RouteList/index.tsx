import { Button, makeStyles } from '@material-ui/core';
import { Fragment, useCallback, useState } from 'react';
import { isSameDay } from 'date-fns';
import { Loading } from 'client/Common/Components/Loading';
import { Route } from './Route';
import { RouteFavList } from 'client/Routing/Components/RouteFavList';
import { RouteHeader } from './RouteHeader';
import { useFetchRouting } from 'client/Routing/provider/useFetchRouting';
import { useRouting } from 'client/Routing/provider/RoutingProvider';
import type { FC } from 'react';

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

export const RouteList: FC = () => {
  const classes = useStyles();
  const { routes, error, earlierContext, laterContext } = useRouting();
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
            <Fragment key={r.checksum}>
              {(i === 0 || !isSameDay(routes[i - 1].date, r.date)) && (
                <RouteHeader date={r.date} />
              )}
              <Route
                detail={detail === r.checksum}
                onClick={() =>
                  setDetail(detail === r.checksum ? undefined : r.checksum)
                }
                route={r}
              />
            </Fragment>
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
