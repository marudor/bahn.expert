import { ConnectionDestination } from '@/client/Common/Components/Connections/ConnectionDestination';
import { ConnectionReachableIcon } from '@/client/Common/Components/Connections/ConnectionReachableIcon';
import { DispositionStatus } from '@/client/Common/Components/Connections/DispositionStatus';
import { FullTransportName } from '@/client/Common/Components/FullTransportName';
import { Platform } from '@/client/Common/Components/Platform';
import { Time } from '@/client/Common/Components/Time';
import { createCancellableComponent } from '@/client/createCancellableComponent';
import {
	type StopDepartureConnect,
	TimeType,
} from '@/external/generated/risConnections';
import { Grid2 } from '@mui/material';
import { differenceInMinutes } from 'date-fns';
import type { FC } from 'react';

interface Props {
	connection: StopDepartureConnect;
}

const CancellableGrid = createCancellableComponent(Grid2);

export const Connection: FC<Props> = ({ connection }) => {
	const timeSchedule = new Date(connection.timeSchedule);
	const time = new Date(connection.time);
	const delay = differenceInMinutes(time, timeSchedule);
	const platformHint =
		connection.platformHint === 'SAME_PHYSICAL_PLATFORM' ||
		connection.platformHint === 'SAME_PLATFORM'
			? 'gleicher Bahnsteig'
			: null;

	return (
		<Grid2
			marginBottom={2}
			container
			sx={{
				'--Grid-borderWidth': '1px',
				borderTop: 'var(--Grid-borderWidth) solid',
				borderLeft: 'var(--Grid-borderWidth) solid',
				borderColor: 'divider',
				'& > div': {
					padding: 1,
					display: 'flex',
					alignItems: 'center',
					borderRight: 'var(--Grid-borderWidth) solid',
					borderBottom: 'var(--Grid-borderWidth) solid',
					borderColor: 'divider',
				},
			}}
		>
			<CancellableGrid size={6} cancelled={connection.canceled}>
				<FullTransportName
					journeyId={connection.journeyID}
					transport={connection.transport}
				/>
			</CancellableGrid>
			<Grid2 size={6}>
				<ConnectionDestination
					cancelled={connection.canceled}
					transport={connection.transport}
				/>
			</Grid2>
			<Grid2 size={3}>
				<Time
					cancelled={connection.canceled}
					delay={delay}
					real={time}
					isPlan={connection.timeType === TimeType.Schedule}
					isRealTime={connection.timeType === TimeType.Real}
					multiLine
				/>
			</Grid2>
			<Grid2 size={3}>
				<Platform
					cancelled={connection.canceled}
					real={connection.platform}
					scheduled={connection.platformSchedule}
				/>
			</Grid2>
			{platformHint && <Grid2 size={4}>{platformHint}</Grid2>}
			<Grid2 size={platformHint ? 2 : 6} justifyContent="center">
				<ConnectionReachableIcon
					connectionStatusByPersona={connection.connectionStatusByPersona}
				/>
			</Grid2>
			<DispositionStatus
				cancelled={connection.canceled}
				dispositionStatus={connection.dispositionStatus}
			/>
		</Grid2>
	);
};
