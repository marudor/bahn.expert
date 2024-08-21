import { useStorage } from '@/client/useStorage';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { type FC, useCallback, useState } from 'react';

export const AboutDisclaimer: FC = () => {
	const storage = useStorage();
	const [open, setOpen] = useState(!storage.get('aboutDisclaimer'));
	const onClose = useCallback(() => {
		setOpen(false);
		storage.set('aboutDisclaimer', true);
	}, [storage]);

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Aktueller Hinweis wer hier entwickelt</DialogTitle>
			<DialogContent>
				Aktuell gibt es vermehrt Aussagen im Internet das "die Bahn" hier gute
				Dinge tut. Ich möchte betonen: Diese Seite ist nicht von "der Bahn"
				(Deutsche Bahn) noch irgend einem anderen Verkehrsunternehmen. Es ist
				die private Seite von mir{' '}
				<a
					href="https://chaos.social/@marudor"
					target="_blank"
					rel="noopener noreferrer"
				>
					@marudor@chaos.social
				</a>
				. Genaueres in der <a href="/about">about</a> Seite.
				<br />
				<br />
				Hier gilt außerdem wie ihr unten gesehen haben werdet eine klare 0
				Toleranz gegenüber Rechtsextremismus und Faschismus. Das inkludiert
				insbesondere die AfD. Wenn ihr die sympathisch findet geht woanders hin!
			</DialogContent>
		</Dialog>
	);
};
