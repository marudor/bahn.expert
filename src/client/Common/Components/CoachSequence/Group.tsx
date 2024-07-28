import { BRInfo } from '@/client/Common/Components/CoachSequence/BRInfo';
import { PrideStripe } from '@/client/Common/Components/CoachSequence/Stripes/PrideStripe';
import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import { journeyNumberFind } from '@/client/Common/service/details';
import type { ParsedJourneyMatchResponse } from '@/types/HAFAS/JourneyMatch';
import type { CoachSequenceGroup } from '@/types/coachSequence';
import { Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
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
}

const RPFRegex = /(RP)(F\d)(\d{5})/;

const prideTZName = 'ICE0304';

const ClickableTrainLink: FC<{
	type: string;
	number: string;
	scheduledDeparture: Date;
}> = ({ type, number, scheduledDeparture }) => {
	const [foundJourney, setFoundJourney] =
		useState<ParsedJourneyMatchResponse>();
	useEffect(() => {
		async function getJourney() {
			try {
				const journeys = await journeyNumberFind(
					Number.parseInt(number),
					scheduledDeparture,
					undefined,
					undefined,
					undefined,
					3,
				);
				const relevantJourney = journeys.filter((j) => j.train.type === type);
				if (relevantJourney.length) {
					setFoundJourney(relevantJourney[0]);
				}
			} catch {
				// we just ignore errors
			}
		}
		void getJourney();
	}, [number, scheduledDeparture, type]);

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
}) => {
	const gruppenPos = useMemo(() => {
		const groupStart = Math.min(
			...gruppe.coaches.map((c) => c.position.startPercent),
		);
		const groupEnd = Math.max(
			...gruppe.coaches.map((c) => c.position.endPercent),
		);
		return {
			left: `${(groupStart - correctLeft) * scale}%`,
			width: `${(groupEnd - groupStart) * scale}%`,
		};
	}, [gruppe.coaches, correctLeft, scale]);

	const extraInfoLine = Boolean(
		showFahrzeugGruppe ||
			showGruppenZugnummer ||
			showDestination ||
			gruppe.trainName ||
			gruppe.baureihe,
	);

	const fahrzeuge = useMemo(() => {
		const wrongWing =
			originalTrainNumber !== gruppe.number &&
			gruppe.coaches.some((f) => !f.closed);
		const StripeElement = gruppe.name === prideTZName ? PrideStripe : undefined;
		return gruppe.coaches.map((c) => {
			return (
				<Coach
					type={type}
					showCoachType={showCoachType}
					showUIC={showUIC}
					scale={scale}
					correctLeft={correctLeft}
					Stripe={StripeElement}
					identifier={gruppe.baureihe?.identifier}
					wrongWing={wrongWing}
					key={`${c.uic}${c.position.startPercent}`}
					fahrzeug={c}
				/>
			);
		});
	}, [
		gruppe,
		originalTrainNumber,
		type,
		showCoachType,
		showUIC,
		scale,
		correctLeft,
	]);

	return (
		<>
			{fahrzeuge}
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
