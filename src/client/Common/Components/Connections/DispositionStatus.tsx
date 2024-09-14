import type { DispositionStatus as DispositionStatusType } from '@/external/generated/risConnections';
import { Grid2 } from '@mui/material';
import type { FC } from 'react';

interface Props {
	dispositionStatus?: DispositionStatusType;
	cancelled?: boolean;
}

export const DispositionStatus: FC<Props> = ({
	dispositionStatus,
	cancelled,
}) => {
	if (!dispositionStatus && !cancelled) {
		return null;
	}

	return (
		<Grid2 size={12}>
			{cancelled
				? 'Halt entfällt'
				: dispositionStatus?.type === 'WAITING'
					? 'wartet'
					: 'wartet nicht'}
		</Grid2>
	);
};
