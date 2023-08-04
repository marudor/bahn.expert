import { Button } from '@mui/material';
import { Fragment, useCallback, useState } from 'react';
import { isSameDay } from 'date-fns';
import { Loading } from '@/client/Common/Components/Loading';
import { Route } from './Route';
import { RouteFavList } from '@/client/Routing/Components/RouteFavList';
import { RouteHeader } from './RouteHeader';
import { useFetchRouting } from '@/client/Routing/provider/useFetchRouting';
import { useRouting } from '@/client/Routing/provider/RoutingProvider';
import styled from '@emotion/styled';
import type { FC } from 'react';

const translateError = (e: any) => {
  if (e?.response?.data) {
    switch (e.response.data.errorCode) {
      case 'H9380': {
        return 'Du bist schon da. Hör auf zu suchen!';
      }
      default: {
        return `${e} (Hafas Code: ${e.response.data.errorCode})`;
      }
    }
  }

  return String(e);
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  & > div {
    padding: 0 0.5em 0 0.1em;
  }
`;

const StyledButton = styled(Button)`
  height: 45px;
  margin: 10px;
  flex: 1;
`;

export const RouteList: FC = () => {
  const { rideableRoutes, error, earlierContext, laterContext } = useRouting();
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
    return <Container>{translateError(error)}</Container>;
  }

  if (!rideableRoutes) return <Loading relative />;
  if (!rideableRoutes.length) return <RouteFavList />;

  return (
    <Container>
      {earlierContext &&
        (loadingEarlier ? (
          <Loading data-testid="fetchCtxEarlyLoading" type={1} />
        ) : (
          <StyledButton
            data-testid="fetchCtxEarly"
            variant="outlined"
            onClick={searchBefore}
          >
            Früher
          </StyledButton>
        ))}
      {rideableRoutes.map((r, i) => {
        return (
          <Fragment key={r.checksum}>
            {(i === 0 ||
              !isSameDay(
                rideableRoutes[i - 1].date,
                rideableRoutes[i].date,
              )) && <RouteHeader date={r.date} />}
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
          <StyledButton
            data-testid="fetchCtxLate"
            variant="outlined"
            onClick={searchLater}
          >
            Später
          </StyledButton>
        ))}
    </Container>
  );
};
