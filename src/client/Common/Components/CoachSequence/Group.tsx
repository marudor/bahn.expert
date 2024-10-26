import { BRInfo } from '@/client/Common/Components/CoachSequence/BRInfo';
import { PrideStripe } from '@/client/Common/Components/CoachSequence/Stripes/PrideStripe';
import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { trpc } from '@/client/RPC';
import type { CoachSequenceGroup } from '@/types/coachSequence';
import { Stack } from '@mui/material';
import { useMemo } from 'react';
import type { FC } from 'react';
import { Coach } from './Coach';
import type { InheritedProps } from './Coach';

interface Props extends InheritedProps {
	gruppe: CoachSequenceGroup;
	showDestination?: boolean;
	showGruppenZugnummer?: boolean;
	showFahrzeugGruppe: boolean;
	originalTrainNumber: string;
	showUIC: boolean;
	showCoachType: boolean;
	scheduledDeparture: Date;
	type: string;
}

const RPFRegex = /(RP)(F\d)(\d{5})/;

const prideTZName = 'ICE0304';

const ClickableTrainLink: FC<{
	type: string;
	number: string;
	scheduledDeparture: Date;
}> = ({ type, number, scheduledDeparture }) => {
	const { data: journeys } = trpc.journey.findByNumber.useQuery(
		{
			trainNumber: Number.parseInt(number),
			initialDepartureDate: scheduledDeparture,
			limit: 3,
			category: type,
		},
		{
			staleTime: Number.POSITIVE_INFINITY,
		},
	);
	const foundJourney = useMemo(
		() => journeys?.find((j) => j.train.type === type),
		[journeys, type],
	);

	if (foundJourney) {
		return (
			<DetailsLink
				train={{
					type,
					number,
				}}
				initialDeparture={scheduledDeparture}
				journeyId={
					foundJourney.jid.includes('-') ? foundJourney.jid : undefined
				}
				jid={foundJourney.jid.includes('|') ? foundJourney.jid : undefined}
			>
				{type} {number}
			</DetailsLink>
		);
	}

	return (
		<span>
			{type} {number}
		</span>
	);
};

export const Group: FC<Props> = ({
	gruppe,
	showDestination,
	showFahrzeugGruppe,
	showGruppenZugnummer,
	originalTrainNumber,
	scheduledDeparture,
	correctLeft,
	scale,
	type,
	showCoachType,
	showUIC,
	reverse,
}) => {
	const gruppenPos = useMemo(() => {
		const groupStart = Math.min(
			...gruppe.coaches.map((c) => c.position.startPercent),
		);
		const groupEnd = Math.max(
			...gruppe.coaches.map((c) => c.position.endPercent),
		);
		const cssName = reverse ? 'right' : 'left';
		return {
			[cssName]: `${(groupStart - correctLeft) * scale}%`,
			width: `${(groupEnd - groupStart) * scale}%`,
		};
	}, [gruppe.coaches, correctLeft, scale, reverse]);

	const extraInfoLine = Boolean(
		showFahrzeugGruppe ||
			showGruppenZugnummer ||
			showDestination ||
			gruppe.trainName ||
			gruppe.baureihe,
	);

	const coaches = useMemo(() => {
		const wrongWing =
			originalTrainNumber !== gruppe.number &&
			gruppe.coaches.some((f) => !f.closed);
		const StripeElement = gruppe.name === prideTZName ? PrideStripe : undefined;
		return gruppe.coaches.map((c) => {
			return (
				<Coach
					showCoachType={showCoachType}
					showUIC={showUIC}
					scale={scale}
					correctLeft={correctLeft}
					Stripe={StripeElement}
					wrongWing={wrongWing}
					key={`${c.uic}${c.position.startPercent}`}
					reverse={reverse}
					fahrzeug={c}
				/>
			);
		});
	}, [
		gruppe,
		originalTrainNumber,
		showCoachType,
		showUIC,
		scale,
		correctLeft,
		reverse,
	]);

	return (
		<>
			{coaches}
			{extraInfoLine && (
				<Stack
					alignItems="center"
					position="absolute"
					bottom="2.5em"
					style={gruppenPos}
				>
					{gruppe.baureihe && <BRInfo br={gruppe.baureihe} />}
					{showGruppenZugnummer && gruppe.number && (
						<ClickableTrainLink
							type={type}
							number={gruppe.number}
							scheduledDeparture={scheduledDeparture}
						/>
					)}
					{showDestination && <span>Ziel: {gruppe.destinationName}</span>}
					{gruppe.trainName && <span>Zugname: "{gruppe.trainName}"</span>}
					{showFahrzeugGruppe && (
						<span data-testid="coachSequenceCoachGroup">
							{gruppe.name.replace(RPFRegex, '$1 $2 $3')}
						</span>
					)}
				</Stack>
			)}
		</>
	);
};
