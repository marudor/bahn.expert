import { DateSelectForDetail } from '@/client/Common/Components/Details/DateSelectForDetail';
import { FullTrainName } from '@/client/Common/Components/FullTrainName';
import { RefreshIconWithSpin } from '@/client/Common/Components/RefreshIconWithSpin';
import { StopPlaceNameWithRl100 } from '@/client/Common/Components/StopPlaceNameWithRl100';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { IconButton, styled } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { addDays } from 'date-fns';
import { useCallback, useMemo } from 'react';
import type { FC } from 'react';
import { BaseHeader } from '../BaseHeader';

const SingleLineSpan = styled('span')(
	({ theme }) => theme.mixins.singleLineText,
);

const Operator = styled(SingleLineSpan)`
  grid-area: o;
`;

const Destination = styled('span')`
  grid-area: g;
  max-height: 2rem;
  overflow: hidden;
  word-break: break-word;
`;

const Container = styled('div')`
  font-size: 90%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr min-content 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: 'p a g' 'd a g' 'o o o';
  align-items: center;
  justify-items: center;
`;

const DateDisplay = styled(SingleLineSpan)`
  display: flex;
  align-items: center;
  grid-area: d;
`;

const Arrow = styled('span')`
  grid-area: a;
  margin-right: 0.2em;
`;

const ArrowBack = styled(ArrowBackIos)`
  height: 0.5em;
  width: 0.5em;
  cursor: pointer;
`;

const ArrowForward = styled(ArrowBack.withComponent(ArrowForwardIos))`
  margin-left: 0.1em;
`;

export const Header: FC = () => {
	const {
		details,

		refreshDetails,
		trainName,
		toggleMapDisplay,
		initialDepartureDate,
		sameTrainDaysInFuture,
		isFetching,
	} = useDetails();
	const refresh = useCallback(() => refreshDetails(), [refreshDetails]);
	const dateForward = useCallback(() => {
		sameTrainDaysInFuture(1);
	}, [sameTrainDaysInFuture]);

	const dateBack = useCallback(() => {
		sameTrainDaysInFuture(-1);
	}, [sameTrainDaysInFuture]);

	const previousArrow = useMemo(() => {
		const date = addDays(
			details?.departure.scheduledTime || initialDepartureDate || new Date(),
			-1,
		);
		return (
			<Link
				css={{ color: 'inherit' }}
				to="/details/$train/$initialDeparture"
				params={{
					train: trainName,
					initialDeparture: date.toISOString(),
				}}
				search={{
					administration: details?.train.admin,
				}}
			>
				<ArrowBack data-testid="previous" />
			</Link>
		);
	}, [details, initialDepartureDate, trainName]);

	const nextArrow = useMemo(() => {
		const date = addDays(
			details?.departure.scheduledTime || initialDepartureDate || new Date(),
			1,
		);
		return (
			<Link
				css={{ color: 'inherit' }}
				to="/details/$train/$initialDeparture"
				params={{
					train: trainName,
					initialDeparture: date.toISOString(),
				}}
				search={{
					administration: details?.train.admin,
				}}
			>
				<ArrowForward data-testid="next" />
			</Link>
		);
	}, [details, initialDepartureDate, trainName]);

	return (
		<BaseHeader>
			<Container data-testid="detailsHeader">
				<SingleLineSpan>
					<FullTrainName train={details?.train} fallback={trainName} />
				</SingleLineSpan>
				<>
					{details?.train.operator && (
						<Operator>{details?.train.operator}</Operator>
					)}
					<DateDisplay>
						{previousArrow}
						<DateSelectForDetail
							date={
								details?.departure.time || initialDepartureDate || new Date()
							}
						/>
						{nextArrow}
					</DateDisplay>
					{/** Displayed as longer arrow, thanks safari that I need a single utf8 */}
					<Arrow> → </Arrow>
					{details && (
						<Destination>
							<StopPlaceNameWithRl100 stopPlace={details.segmentDestination} />
						</Destination>
					)}
				</>
			</Container>
			{/* {polyline && (
				<IconButton
					size="small"
					onClick={toggleMapDisplay}
					aria-label="map"
					color="inherit"
				>
					<Map />
				</IconButton>
			)} */}
			<IconButton
				size="small"
				onClick={refresh}
				aria-label="refresh"
				color="inherit"
			>
				<RefreshIconWithSpin
					data-testid={isFetching ? 'refreshIconLoading' : 'refreshIcon'}
					loading={isFetching}
				/>
			</IconButton>
		</BaseHeader>
	);
};
