import { AuslastungsDisplay } from '@/client/Common/Components/AuslastungsDisplay';
import { TravelynxLink } from '@/client/Common/Components/CheckInLink/TravelynxLink';
import { ConnectionIcon } from '@/client/Common/Components/Connections/ConnectionIcon';
import { CodeShares } from '@/client/Common/Components/Details/CodeShares';
import { Continuation } from '@/client/Common/Components/Details/Continuation';
import { TransportName } from '@/client/Common/Components/Details/TransportName';
import { TravelsWith } from '@/client/Common/Components/Details/TravelsWith';
import { Platform } from '@/client/Common/Components/Platform';
import { StopPlaceLink } from '@/client/Common/Components/StopPlaceLink';
import { Time } from '@/client/Common/Components/Time';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import type {
	TransportDestinationRef,
	TransportOriginRef,
} from '@/external/generated/risJourneysV2';
import type { ParsedProduct } from '@/types/HAFAS';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { RouteStop } from '@/types/routing';
import { Stack, Tooltip, styled } from '@mui/material';
import { useCallback, useMemo } from 'react';
import type { FC, MouseEvent } from 'react';
import { CoachSequence } from '../CoachSequence/CoachSequence';
import { DetailMessages } from '../Messages/Detail';
import { Messages } from './Messages';

const ArrivalTime = styled(Time)`
  grid-area: ar;
`;

const DepartureTime = styled(Time)`
  grid-area: dp;
`;

const StopName = styled('span')<{ stop: RouteStop }>(
	{
		gridArea: 't',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		'> a': {
			color: 'inherit',
		},
	},
	{
		variants: [
			{
				props: ({ stop }) => stop.additional,
				style: ({ theme }) => theme.mixins.additional,
			},
			{
				props: ({ stop }) => stop.cancelled,
				style: ({ theme }) => theme.mixins.cancelled,
			},
		],
	},
);

const ScrollMarker = styled('div')`
  position: absolute;
  top: -64px;
`;

const ArrivalPlatform = styled(Platform)`
  grid-area: arrP;
`;

const DeparturePlatform = styled(Platform)`
  grid-area: depP;
`;

const CoachSequenceContainer = styled('div')`
  grid-area: wr;
  font-size: 0.5em;
  overflow: hidden;
`;

const MessageContainer = styled('div')`
  grid-area: m;
  padding-left: 1em;
`;

const StyledTravelynxLink = styled(TravelynxLink)`
	display: flex;
  grid-area: c;
	transform: translateY(.15em);
`;

const StyledOccupancy = styled(AuslastungsDisplay)`
  grid-area: o;
`;

const StyledConnectionIcon = styled(ConnectionIcon)`
	transform: scale(.85);
	grid-area: con;
`;

const Container = styled('div')<{
	past?: boolean;
	hasOccupancy: boolean;
	samePlatform: boolean;
}>(
	({ theme, hasOccupancy, samePlatform }) => ({
		padding: '.1em .3em',
		display: 'grid',
		gridGap: '0 .3em',
		gridTemplateAreas: `"ar t ${samePlatform ? 'depP' : 'arrP'} con c" "dp ${
			hasOccupancy ? 'o' : 't'
		} depP con c" "tw tw tw tw tw" "m m m m m" "wr wr wr wr wr"`,
		alignItems: 'center',
		borderBottom: `1px solid ${theme.vars.palette.text.primary}`,
		position: 'relative',
		gridTemplateColumns: '4.8em 1fr max-content max-content max-content',
	}),
	{
		variants: [
			{
				props: { past: true },
				style: ({ theme }) => ({
					backgroundColor: theme.vars.palette.common.shadedBackground,
					'> *': {
						'--mui-palette-common-shadedBackground':
							theme.vars.palette.common.doubleShadedBackground,
					},
				}),
			},
		],
	},
);

interface Props {
	journey?: ParsedSearchOnTripResponse;
	stop: RouteStop;
	train?: ParsedProduct;
	showWR?: ParsedProduct;
	isPast?: boolean;
	initialDepartureDate?: Date;
	onStopClick?: (stop: RouteStop) => void;
	doNotRenderOccupancy?: boolean;
	continuationFor?: TransportOriginRef[];
	continuationBy?: TransportDestinationRef[];
}
export const Stop: FC<Props> = ({
	journey,
	stop,
	showWR,
	train,
	isPast,
	initialDepartureDate,
	onStopClick,
	doNotRenderOccupancy,
	continuationBy,
	continuationFor,
}) => {
	const { urlPrefix, additionalInformation } = useDetails();
	const occupancy = useMemo(
		() =>
			additionalInformation?.occupancy[stop.station.evaNumber] ||
			stop.auslastung,
		[stop, additionalInformation],
	);

	const [platforms, showArrivalPlatform] = useMemo(() => {
		const platforms = {
			arrival: {
				real: stop.arrival?.platform,
				scheduled: stop.arrival?.scheduledPlatform,
				cancelled: stop.arrival?.cancelled,
			},
			departure: {
				real: stop.departure?.platform,
				scheduled: stop.departure?.scheduledPlatform,
				cancelled: stop.departure?.cancelled,
			},
		};
		const bothExist = stop.departure && stop.arrival;
		const samePlatform =
			platforms.arrival.scheduled === platforms.departure.scheduled &&
			platforms.arrival.real === platforms.departure.real;

		if (
			(stop.arrival && !stop.departure) ||
			(samePlatform && platforms.departure.cancelled)
		) {
			platforms.departure = platforms.arrival;
		}

		return [platforms, !bothExist || samePlatform];
	}, [stop.arrival, stop.departure]);

	const onClick = useCallback(
		(e: MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();
			onStopClick?.(stop);
		},
		[stop, onStopClick],
	);

	return (
		<Container
			hasOccupancy={Boolean(occupancy) && !doNotRenderOccupancy}
			past={isPast}
			data-testid={stop.station.evaNumber}
			onClick={onClick}
			samePlatform={showArrivalPlatform}
		>
			<ScrollMarker id={stop.station.evaNumber} />
			{stop.arrival && (
				<ArrivalTime
					isPlan={stop.arrival.isPlan}
					cancelled={stop.arrival.cancelled}
					real={stop.arrival.time}
					delay={stop.arrival.delay}
					isRealTime={stop.arrival.isRealTime}
				/>
			)}
			<StopName stop={stop}>
				<StopPlaceLink stopPlace={stop.station} urlPrefix={urlPrefix} />
			</StopName>
			{!doNotRenderOccupancy && occupancy && (
				<StyledOccupancy
					oneLine
					auslastung={{
						occupancy,
					}}
				/>
			)}
			{train && (
				<StyledTravelynxLink
					evaNumber={stop.station.evaNumber}
					train={train}
					departure={stop.departure}
					arrival={stop.arrival}
				/>
			)}
			{stop.departure && (
				<DepartureTime
					cancelled={stop.departure.cancelled}
					real={stop.departure.time}
					delay={stop.departure.delay}
					isRealTime={stop.departure.isRealTime}
					isPlan={stop.departure.isPlan}
				/>
			)}
			{stop.arrival?.id && !stop.arrival.cancelled && (
				<StyledConnectionIcon journey={journey} stop={stop} />
			)}
			<DeparturePlatform
				data-testid="departurePlatform"
				{...platforms.departure}
			/>
			{!showArrivalPlatform && (
				<ArrivalPlatform data-testid="arrivalPlatform" {...platforms.arrival} />
			)}
			<Stack gridArea="tw" paddingLeft={1} width="fit-content">
				{stop.newTransport && (
					<span>
						Fährt weiter als <TransportName transport={stop.newTransport} />
					</span>
				)}
				<Continuation
					continuationFor={continuationFor}
					continuationBy={continuationBy}
				/>
				<TravelsWith
					stopEva={stop.station.evaNumber}
					joinsWith={stop.joinsWith}
					splitsWith={stop.splitsWith}
				/>
				<AllowEntry arrival={stop.arrival} departure={stop.departure} />
			</Stack>
			<CoachSequenceContainer>
				{showWR?.number &&
					showWR?.type &&
					stop.departure &&
					!stop.cancelled && (
						<CoachSequence
							trainNumber={showWR.number}
							trainCategory={showWR.type}
							currentEvaNumber={stop.station.evaNumber}
							scheduledDeparture={stop.departure.scheduledTime}
							initialDeparture={initialDepartureDate}
							administration={train?.admin}
							loadHidden
						/>
					)}
			</CoachSequenceContainer>
			<MessageContainer>
				<CodeShares codeShares={stop.codeShares} />
				{stop.irisMessages && <DetailMessages messages={stop.irisMessages} />}
				<Messages messages={stop.messages} />
			</MessageContainer>
		</Container>
	);
};

interface AllowEntryProps {
	arrival?: RouteStop['arrival'];
	departure?: RouteStop['departure'];
}

const AllowEntry: FC<AllowEntryProps> = ({ arrival, departure }) => {
	if (arrival?.noPassengerChange && departure?.noPassengerChange) {
		return (
			<Tooltip title="Kein Einstieg & Kein Ausstieg garantiert">
				<span>Betriebshalt</span>
			</Tooltip>
		);
	}
	if (arrival?.noPassengerChange) {
		return <span>Kein Ausstieg</span>;
	}
	if (departure?.noPassengerChange) {
		return <span>Kein Einstieg</span>;
	}
};
