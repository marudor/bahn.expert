import { StopPlaceNameWithRl100 } from '@/client/Common/Components/StopPlaceNameWithRl100';
import { createCancellableComponent } from '@/client/createCancellableComponent';
import type { TransportPublicDestinationVia } from '@/external/generated/risConnections';
import { Stack } from '@mui/material';
import type { FC } from 'react';

interface Props {
	transport: TransportPublicDestinationVia;
	cancelled?: boolean;
}

const CancellableStopPlaceName = createCancellableComponent(
	StopPlaceNameWithRl100,
);

export const ConnectionDestination: FC<Props> = ({ transport, cancelled }) => {
	const scheduledDestination = (
		<CancellableStopPlaceName
			stopPlace={transport.destination}
			withAbfahrtenLink
			cancelled={Boolean(transport.differingDestination) || cancelled}
		/>
	);

	if (!transport.differingDestination || cancelled) {
		return scheduledDestination;
	}

	return (
		<Stack>
			{scheduledDestination}
			<CancellableStopPlaceName
				stopPlace={transport.differingDestination}
				withAbfahrtenLink
				cancelled={cancelled}
			/>
		</Stack>
	);
};
