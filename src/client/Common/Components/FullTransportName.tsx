import type { TransportPublicDestination } from '@/external/generated/risConnections';
import type { Transport } from '@/external/generated/risJourneysV2';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

interface Props {
	transport:
		| Pick<Transport, 'journeyNumber' | 'line' | 'category'>
		| Pick<TransportPublicDestination, 'category' | 'line' | 'number'>;
	journeyId?: string;
}

export const FullTransportName: FC<Props> = ({ transport, journeyId }) => {
	const journeyNumber =
		'journeyNumber' in transport ? transport.journeyNumber : transport.number;
	let trainName = transport.category;

	if (transport.line) {
		trainName += ` ${transport.line} (${journeyNumber})`;
	} else {
		trainName += ` ${journeyNumber}`;
	}

	if (journeyId) {
		return (
			<Link
				data-testid="fullTransportName"
				to="/details/$train"
				params={{
					train: `${transport.category} ${journeyNumber}`,
				}}
				search={{
					journeyId,
				}}
			>
				{trainName}
			</Link>
		);
	}

	return <span data-testid="fullTransportName">{trainName}</span>;
};
