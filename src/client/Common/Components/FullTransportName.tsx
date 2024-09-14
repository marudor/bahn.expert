import type { TransportPublicDestination } from '@/external/generated/risConnections';
import type { Transport } from '@/external/generated/risJourneysV2';
import qs from 'qs';
import type { FC } from 'react';
import { Link } from 'react-router-dom';

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
				to={`/details/${transport.category} ${journeyNumber}${qs.stringify(
					{
						journeyId,
					},
					{ addQueryPrefix: true },
				)}`}
			>
				{trainName}
			</Link>
		);
	}

	return <span data-testid="fullTransportName">{trainName}</span>;
};
