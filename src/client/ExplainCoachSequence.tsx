import { useStorage } from '@/client/useStorage';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { type FC, useCallback, useState } from 'react';

export const ExplainCoachSequence: FC = () => {
	const storage = useStorage();
	const seen = storage.get('seenCoachSequence') ?? true;
	const [open, setOpen] = useState(seen);
	const setClose = useCallback(() => {
		storage.set('seenCoachSequence', true);
		setOpen(false);
	}, [storage]);

	return (
		<Dialog open={open} onClose={setClose}>
			<DialogTitle>Fehlende Wagenreihungen</DialogTitle>
			<DialogContent>
				Leider hat bahn.expert aktuell keine, bzw fast keine Wagenreihung. Nach
				~10 Jahren Zugriff auf verschiedenste APIs werd ich sehr aktiv geblockt
				und kann aktuell keine Wagenreihung zur verfügung stellen.
				<br />
				Da das Feature ein sehr Zentrales ist und hier gar nicht so wenig
				Nutzende sind. Beschwert euch doch mal bei der Bahn. Wenn das genug
				machen könnte das was bringen.
				<br />
				Allgemeines Feedback gibts hier:{' '}
				<a
					href="https://www.bahn.de/kontakt/feedback-allgemein"
					target="_blank"
					rel="noreferrer"
				>
					https://www.bahn.de/kontakt/feedback-allgemein
				</a>
				<br />
				Im Hintergrund versuch ich das ganze noch zu lösen. Das wird aber wenn
				dann auch etwas dauern.
			</DialogContent>
		</Dialog>
	);
};
