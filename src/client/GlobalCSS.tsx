import { GlobalStyles, type Theme } from '@mui/material';
import type { FC } from 'react';

const globalStyles = (theme: Theme): any => ({
	body: {
		margin: 0,
		fontFamily: 'Roboto, sans-serif',
		backgroundColor: theme.vars.palette.background.default,
		color: theme.vars.palette.text.primary,
	},
	a: {
		textDecoration: 'none',
		color: theme.vars.palette.common.blue,
	},
	'html, body': {
		height: '100%',
	},
	'#app': {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	'.maplibregl-popup-content': {
		color: 'black',
	},
});

export const GlobalCSS: FC = () => <GlobalStyles styles={globalStyles} />;
