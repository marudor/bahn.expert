import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import type { FC } from 'react';

export const BC100Disclaimer: FC = () => {
	const [open, setOpen] = useState(true);
	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			scroll="body"
			open={open}
			onClose={() => setOpen(false)}
		>
			<DialogTitle>BC100 Disclaimer</DialogTitle>
			<DialogContent>
				Dieser Filter funktioniert NICHT mit "bahn.de" als Backend! <br />
				Dieser Filter nimmt alle Fahrten raus welche mit "DB-Fahrscheine gelten
				nicht" markiert sind. <br />
				Ganz konkret basiert es auf dem Attribut "DU". Keine Garantie das nicht
				doch Verbindungen ausgegeben werden welche nicht gefahren werden dürfen!
				Bitte informiert euch selbstständig!
			</DialogContent>
		</Dialog>
	);
};
