import { useExpertCookies } from '@/client/Common/hooks/useExpertCookies';
import { Alert, Snackbar, type SnackbarOrigin } from '@mui/material';
import { type FC, useCallback, useState } from 'react';

const anchorOrigin: SnackbarOrigin = {
	vertical: 'bottom',
	horizontal: 'center',
};

export const Feedback: FC = () => {
	const [{ timesFeedback }, setCookie] = useExpertCookies(['timesFeedback']);
	const [open, setOpen] = useState(!timesFeedback || timesFeedback < 8);
	const setClose = useCallback(() => {
		let timesSeen = timesFeedback ?? 0;
		if (typeof timesSeen !== 'number') {
			timesSeen = 0;
		}
		setCookie('timesFeedback', timesSeen + 1);
		setOpen(false);
	}, [setCookie, timesFeedback]);
	return (
		<Snackbar
			open={open}
			onClick={setClose}
			onClose={setClose}
			autoHideDuration={15000}
			anchorOrigin={anchorOrigin}
		>
			<Alert severity="info" icon={false}>
				Wenn ihr diese Seite im Bahnbetrieb nutzt: bitte schickt mir feedback an
				feedback@bahn.expert! Danke!
			</Alert>
		</Snackbar>
	);
};
