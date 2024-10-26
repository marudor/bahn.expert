import { Alert, AlertTitle, Snackbar } from '@mui/material';
import { type FC, useCallback, useState } from 'react';

export const Disruption: FC = () => {
	const [open, setOpen] = useState(Boolean(globalThis.DISRUPTION));
	const setClose = useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<Snackbar
			open={open}
			onClick={setClose}
			onClose={setClose}
			anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
		>
			<Alert severity="error">
				<AlertTitle>Störung</AlertTitle>
				<div dangerouslySetInnerHTML={{ __html: globalThis.DISRUPTION! }} />
			</Alert>
		</Snackbar>
	);
};
