import { ConnectionDisplay } from '@/client/Common/Components/Connections/ConnectionDisplay';
import type { ParsedSearchOnTripResponse } from '@/types/HAFAS/SearchOnTrip';
import type { RouteStop } from '@/types/routing';
import { DepartureBoard } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { differenceInHours } from 'date-fns';
import { type FC, type MouseEvent, useCallback, useState } from 'react';

interface Props {
	journey?: ParsedSearchOnTripResponse;
	stop: RouteStop;
	className?: string;
}

export const ConnectionIcon: FC<Props> = ({ journey, stop, className }) => {
	const [open, setOpen] = useState(false);
	const toggle = useCallback((e: MouseEvent) => {
		e.stopPropagation();
		setOpen((old) => !old);
	}, []);
	if (!journey?.journeyId || !stop.arrival?.id) {
		return null;
	}

	// Only offer to get connections within 20 hours of arrival
	if (Math.abs(differenceInHours(stop.arrival.time, Date.now())) > 20) {
		return null;
	}

	return (
		<>
			<ConnectionDisplay
				journey={journey}
				// @ts-expect-error has arrival, we checked
				stop={stop}
				open={open}
				toggle={toggle}
			/>
			<Tooltip title="Anschlüsse">
				<IconButton size="small" onClick={toggle} className={className}>
					<DepartureBoard />
				</IconButton>
			</Tooltip>
		</>
	);
};
