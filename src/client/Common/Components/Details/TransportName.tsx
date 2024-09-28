import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import type { TransportDestinationPortionWorkingRef } from '@/external/generated/risJourneysV2';
import type { FC } from 'react';

interface Props {
	transport: Pick<
		TransportDestinationPortionWorkingRef,
		'journeyNumber' | 'category' | 'line'
	> & {
		journeyID?: string;
	};
	initialDeparture?: Date;
}

export const TransportName: FC<Props> = ({
	transport,
	initialDeparture = new Date(),
}) => {
	return (
		<DetailsLink
			train={{
				number: transport.journeyNumber.toString(),
				type: transport.category,
			}}
			initialDeparture={initialDeparture}
			journeyId={transport.journeyID}
		>
			{transport.category}{' '}
			{transport.line
				? `${transport.line} (${transport.journeyNumber})`
				: transport.journeyNumber}
		</DetailsLink>
	);
};
