import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import { Dialog, DialogContent } from '@mui/material';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import type { FC } from 'react';

export const PolitikPopup: FC = () => {
	const { noHeader } = useSearch({ strict: false });
	const [{ bw2025 }, setCookie] = useExpertCookies(['bw2025']);
	const [open, setOpen] = useState(!noHeader && (!bw2025 || bw2025 < 2));
	const close = useCallback(() => {
		let timesSeen = bw2025 ?? 0;
		if (typeof timesSeen !== 'number') {
			timesSeen = 0;
		}
		setCookie('bw2025', timesSeen + 1);
		setOpen(false);
	}, [bw2025, setCookie]);

	if (!open) {
		return null;
	}

	return (
		<Dialog open={open} onClose={close}>
			{/* <DialogTitle>Ich bin sauer (Politik)</DialogTitle> */}
			<DialogContent>
				Am 23. Februar findet die Bundestagswahl statt. Die Europawahl 2024 war
				mehr als ernüchternd. Die Faschisten der AfD werden vermutlich eine
				starke Fraktion im Bundestag bilden und die unter Merz noch weiter nach
				rechts gerückte Union wird genau diesen zum Kanzler macht.
				<br />
				Egal ob schwarz oder blau - beide Parteien führen mit Unwahrheiten
				Wahlkampf, in denen sie beide ihrer Menschenfeindlichkeit freien Lauf
				lassen. Es wird den meisten Menschen mit diesen beiden Parteien nicht
				besser gehen sondern schlechter.
				<br />
				<br />
				Dem Rechtsextremismus kein Fuß breit heißt auch, nicht die Union zu
				wählen. Das heißt, den netten Dorfnazis in die Schranken zu weisen. Das
				heißt sich vor diejenigen stellen, die von Nazis attackiert und bedroht
				werden. Das heißt kontra geben in eurem Umfeld.
				<br />
				<br />
				Siamo tutti antifascist - kein Fußbreit den Faschisten!
			</DialogContent>
		</Dialog>
	);
};
