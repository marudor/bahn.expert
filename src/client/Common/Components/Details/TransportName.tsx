import { DetailsLink } from '@/client/Common/Components/Details/DetailsLink';
import type { TransportPublicDestinationPortionWorking } from '@/external/generated/risJourneys';
import type { FC } from 'react';

interface Props {
	transport: TransportPublicDestinationPortionWorking;
}

export const TransportName: FC<Props> = ({ transport }) => {
	return (
		<DetailsLink
			train={{
				number: transport.number.toString(),
				type: transport.category,
			}}
			initialDeparture={new Date()}
			journeyId={transport.journeyID}
		>
			{transport.category}{' '}
			{transport.line
				? `${transport.line} (${transport.number})`
				: transport.number}
		</DetailsLink>
	);
};
