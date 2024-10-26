import { VehicleMapDialog } from '@/client/Common/Components/VehicleMap/VehicleMapDialog';
import { trpc } from '@/client/RPC';
import type { CoachSequenceCoach } from '@/types/coachSequence';
import { css } from '@mui/material';
import type { FC } from 'react';

const linkCss = css`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
`;

interface Props {
	fahrzeug: CoachSequenceCoach;
}

export const WagenLink: FC<Props> = ({ fahrzeug }) => {
	const { data: vehicleLayout } = trpc.coachSequences.vehicleLayout.useQuery(
		fahrzeug.uic!,
		{
			enabled: Boolean(fahrzeug.uic) && Boolean(fahrzeug.identificationNumber),
			staleTime: Number.POSITIVE_INFINITY,
		},
	);

	if (vehicleLayout) {
		return (
			<VehicleMapDialog vehicleLayout={vehicleLayout} fahrzeug={fahrzeug}>
				{fahrzeug.type}
			</VehicleMapDialog>
		);
	}

	return (
		<span data-testid="coachType" css={linkCss}>
			{fahrzeug.type}
		</span>
	);
};
