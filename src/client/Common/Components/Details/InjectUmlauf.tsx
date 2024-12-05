import { TransportName } from '@/client/Common/Components/Details/TransportName';
import { useDetails } from '@/client/Common/provider/DetailsProvider';
import { trpc } from '@/client/RPC';
import type { MatchVehicleID } from '@/external/generated/risTransports';
import { Stack } from '@mui/material';
import { useMemo } from 'react';

interface Props {
	prevNext: MatchVehicleID[];
}

const Umlauf: FCC<Props> = ({ children, prevNext }) => {
	if (!prevNext.length) {
		return null;
	}
	return (
		<Stack direction="row" gap={0.5} data-testid="umlauf">
			{children}
			{prevNext.map((p) => (
				<TransportName
					data-testid={p.journeyID}
					key={p.journeyID}
					initialDeparture={new Date(p.journeyRelation.startTime)}
					transport={{
						journeyNumber: p.journeyRelation.startJourneyNumber,
						category: p.journeyRelation.startCategory,
						journeyID: p.journeyID,
					}}
				/>
			))}
		</Stack>
	);
};

export const InjectUmlauf: FCC = ({ children }) => {
	const { details } = useDetails();
	const firstDepartureStop = useMemo(
		() => details?.stops.find((s) => s.departure && !s.departure.cancelled),
		[details],
	);

	const { data: firstSequence } = trpc.coachSequence.sequence.useQuery(
		{
			evaNumber: firstDepartureStop?.station.evaNumber!,
			departure: firstDepartureStop?.departure?.scheduledTime!,
			trainNumber: Number.parseInt(details?.train.number!),
			administration: details?.train.admin,
			initialDeparture: details?.departure.scheduledTime!,
			category: details?.train.type!,
		},
		{
			enabled: Boolean(firstDepartureStop),
		},
	);
	const { data: prevNext } = trpc.coachSequence.umlauf.useQuery(
		{
			journeyId: details?.journeyId!,
			initialDeparture: details?.departure.scheduledTime!,
			vehicleIds:
				firstSequence?.sequence?.groups
					.filter((g) => g.number === details?.train.number)
					// .map((g) => g.coaches[2]?.uic)
					.map((g) => g.coaches.find((c) => !c.closed)?.uic)
					.filter(Boolean) || [],
		},
		{
			enabled: Boolean(firstSequence && details?.journeyId),
		},
	);

	if (!firstDepartureStop || !prevNext) {
		return children;
	}
	return (
		<>
			<Umlauf prevNext={prevNext.previousJourneys}>Wendet aus</Umlauf>
			{children}
			<Umlauf prevNext={prevNext.nextJourneys}>Wendet auf</Umlauf>
		</>
	);
};
