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
	'Nazis morden, der Staat schiebt ab – das ist das gleiche Rassistenpack',
	'AfDler verpisst euch – keiner vermisst euch',
	'Seenotrettung ist kein Verbrechen',
	'Nein heißt Nein, No means No, wer das sagt der meints auch so',
];

const anchorOrigin: SnackbarOrigin = {
	vertical: 'bottom',
	horizontal: 'center',
};

export const PolitikBanner: FC = () => {
	const [{ timesPoliticSeen2 }, setCookie, removeCookie] = useExpertCookies([
		'timesPoliticSeen2',
	]);
	const initialOpen = !timesPoliticSeen2 || timesPoliticSeen2 < 20;
	const [open, setOpen] = useState(initialOpen);
	useEffect(() => {
		if (Math.random() * 100 < 0.75) {
			removeCookie('timesPoliticSeen2');
		}
	}, [removeCookie]);
	const setClose = useCallback(() => {
		let timesSeen = timesPoliticSeen2 ?? 0;
		if (typeof timesSeen !== 'number') {
			timesSeen = 0;
		}
		setCookie('timesPoliticSeen2', timesSeen + 1);
		setOpen(false);
	}, [setCookie, timesPoliticSeen2]);
	const selectedText = useMemo(
		() => possibleTexts[Math.floor(Math.random() * possibleTexts.length)],
		[],
	);

	if (globalThis.DISRUPTION) {
		return null;
	}

	return (
		<>
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
		</>
	);
};
