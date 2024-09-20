import { VehicleMap } from '@/client/Common/Components/VehicleMap/VehicleMap';
import type { VehicleLayoutFeatureCollection } from '@/external/generated/risMaps';
import type { CoachSequenceCoach } from '@/types/coachSequence';
import { Dialog, DialogContent, DialogTitle, styled } from '@mui/material';
import { type SyntheticEvent, useCallback, useState } from 'react';

interface Props {
	vehicleLayout: VehicleLayoutFeatureCollection;
	fahrzeug: CoachSequenceCoach;
}

const LinkSpan = styled('span')(({ theme }) => ({
	position: 'absolute',
	top: '100%',
	left: '50%',
	transform: 'translateX(-50%);',
	cursor: 'pointer',
	color: theme.vars.palette.common.blue,
}));

export const VehicleMapDialog: FCC<Props> = ({
	vehicleLayout,
	fahrzeug,
	children,
}) => {
	const [open, setOpen] = useState(false);
	const handleLinkClick = useCallback((e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setOpen((old) => !old);
	}, []);

	return (
		<>
			<LinkSpan data-testid="coachType" onClick={handleLinkClick}>
				{children}
			</LinkSpan>
			<Dialog open={open} onClose={handleLinkClick} fullWidth maxWidth="xl">
				<DialogTitle>
					Layout von Wagen {fahrzeug.identificationNumber} (Fahrzeug{' '}
					{fahrzeug.uic})
				</DialogTitle>
				<DialogContent>
					<VehicleMap
						layout={vehicleLayout}
						orientation={fahrzeug.orientation!}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
};
