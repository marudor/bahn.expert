import { TransportName } from '@/client/Common/Components/Details/TransportName';
import type { TransportDestinationPortionWorkingRef } from '@/external/generated/risJourneysV2';
import type { FC } from 'react';

interface Props {
	joinsWith?: TransportDestinationPortionWorkingRef[];
	splitsWith?: TransportDestinationPortionWorkingRef[];
	stopEva: string;
}

export const TravelsWith: FC<Props> = ({ joinsWith, splitsWith, stopEva }) => {
	const joins = joinsWith?.map((j) => (
		<span key={j.journeyID}>
			Vereinigung mit <TransportName transport={j} /> bis{' '}
			{j.separationAt?.name ||
				j.differingDestination?.name ||
				j.destination.name}
		</span>
	));
	const splits = splitsWith?.map((j) => {
		if (
			stopEva ===
			(j.differingDestination?.evaNumber || j.destination?.evaNumber)
		) {
			return (
				<span key={j.journeyID}>
					<TransportName transport={j} /> endet in{' '}
					{j.differingDestination?.name || j.destination?.name}
				</span>
			);
		}
		return (
			<span key={j.journeyID}>
				<TransportName transport={j} /> fährt weiter nach{' '}
				{j.differingDestination?.name || j.destination?.name}
			</span>
		);
	});

	return (
		<>
			{joins}
			{splits}
		</>
	);
};
