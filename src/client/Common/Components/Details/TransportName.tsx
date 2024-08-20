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
}

export const TransportName: FC<Props> = ({ transport }) => {
	return (
		<DetailsLink
			train={{
				number: transport.journeyNumber.toString(),
				type: transport.category,
			}}
			initialDeparture={new Date()}
			journeyId={transport.journeyID}
		>
			{transport.category}{' '}
			{transport.line
				? `${transport.line} (${transport.journeyNumber})`
				: transport.journeyNumber}
		</DetailsLink>
	);
};
