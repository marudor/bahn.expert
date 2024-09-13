import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import { Alert, Snackbar } from '@mui/material';
import type { SnackbarOrigin } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FC } from 'react';

const possibleTexts = [
	'Du bist die Brandmauer gegen Rechts',
	'"Unpolitisch" ist politisch',
	'Die AfD ist die mit Abstand größte Gefahr für unsere Gesellschaft! #AfDVerbotJetzt',
	'Sich an Antifaschismus stören ist so 1933',
	'Dieser Service wird nicht von Faschisten finanziert',
	'Menschenrechte statt rechte Menschen',
	'Kein Mensch ist illegal',
	'"Nie wieder" ist immer, nicht nur alle 4 Jahre beim Kreuzchen machen',
	'Kein Platz für Rassismus',
	'Trans rights are human rights',
	'Trans rights or riot nights',
	'Die Brandmauer ist überall. Auch auf der Drehscheibe!',
	'#EisenbahnerAntifa',
];

const anchorOrigin: SnackbarOrigin = {
	vertical: 'bottom',
	horizontal: 'center',
};

export const PolitikBanner: FC = () => {
	const [{ timesPoliticSeenNew }, setCookie, removeCookie] = useExpertCookies([
		'timesPoliticSeenNew',
	]);
	const [open, setOpen] = useState(
		!timesPoliticSeenNew || timesPoliticSeenNew < 14,
	);
	useEffect(() => {
		if (Math.random() * 100 < 0.75) {
			removeCookie('timesPoliticSeenNew');
		}
	}, [removeCookie]);
	const setClose = useCallback(() => {
		let timesSeen = timesPoliticSeenNew ?? 0;
		if (typeof timesSeen !== 'number') {
			timesSeen = 0;
		}
		setCookie('timesPoliticSeenNew', timesSeen + 1);
		setOpen(false);
	}, [setCookie, timesPoliticSeenNew]);
	const selectedText = useMemo(
		() => possibleTexts[Math.floor(Math.random() * possibleTexts.length)],
		[],
	);

	return (
		<Snackbar
			open={open}
			onClick={setClose}
			onClose={setClose}
			autoHideDuration={17500}
			anchorOrigin={anchorOrigin}
		>
			<Alert severity="info" icon={false}>
				{selectedText}
			</Alert>
		</Snackbar>
	);
};
