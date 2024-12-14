import { Loading } from '@/client/Common/Components/Loading';
import { RouteFavList } from '@/client/Routing/Components/RouteFavList';
import { useRouting } from '@/client/Routing/provider/RoutingProvider';
import { useFetchRouting } from '@/client/Routing/provider/useFetchRouting';
import { Button, styled } from '@mui/material';
import { isSameDay } from 'date-fns';
import { Fragment, useCallback, useState } from 'react';
import type { FC } from 'react';
import { Route } from './Route';
import { RouteHeader } from './RouteHeader';

const translateError = (e: any) => {
	if (e?.message) {
		switch (e.message) {
			case 'H9380': {
				return 'Du bist schon da. Hör auf zu suchen! (Start/Ziel ist equivalent für den Router)';
			}
			case 'H890': {
				return 'Für diese Suche gibt es kein Ergebnis. Filter überprüfen?';
			}
			default: {
				if (e.message.startsWith('H')) {
					return `Hafas Fehler Code: ${e.message}`;
				}
			}
		}
	}

	return String(e);
};

const Container = styled('div')`
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
					<Fragment key={r.id}>
						{(i === 0 ||
							!isSameDay(
								rideableRoutes[i - 1].date,
								rideableRoutes[i].date,
							)) && <RouteHeader date={r.date} />}
						<Route
							detail={detail === r.id}
							onClick={() => setDetail(detail === r.id ? undefined : r.id)}
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
