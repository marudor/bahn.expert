import { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Loading from 'client/Common/Components/Loading';
import Route from './Route';
import RouteFavList from 'client/Routing/Components/RouteFavList';
import RouteHeader from './RouteHeader';
import RoutingContainer from 'client/Routing/container/RoutingContainer';
import styled from 'styled-components/macro';
import useFetchRouting from 'client/Routing/container/RoutingContainer/useFetchRouting';

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

const StyledButton = styled(Button)`
  height: 45px;
  margin: 10px;
  flex: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  > div {
    padding-left: 0.1em;
    padding-right: 0.5em;
  }
`;

const RouteList = () => {
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
    return <Wrapper>{translateError(error)}</Wrapper>;
  }

  if (!routes) return <Loading relative />;
  if (!routes.length) return <RouteFavList />;

  return (
    <Wrapper>
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
          <StyledButton
            data-testid="fetchCtxLate"
            variant="outlined"
            onClick={searchLater}
          >
            Später
          </StyledButton>
        ))}
    </Wrapper>
  );
};

export default RouteList;
