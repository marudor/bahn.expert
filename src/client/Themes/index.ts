import {
	blue,
	green,
	indigo,
	lightGreen,
	orange,
	purple,
	red,
	yellow,
} from '@mui/material/colors';
import { createTheme, darken, lighten } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';
declare module '@mui/system' {
	interface Shape {
		headerSpacing: string;
	}
}

declare module '@mui/material/styles' {
	interface CommonColors {
		pride: string;
		red: string;
		green: string;
		yellow: string;
		orange: string;
		blue: string;
		transparentBackground: string;
		shadedBackground: string;
		doubleShadedBackground: string;
	}
}

// unit: em
const headerSpacing = 3.5;

const pride =
	'linear-gradient(180deg, #FE0000 16.66%,#FD8C00 16.66%, 33.32%,#FFE500 33.32%, 49.98%,#119F0B 49.98%, 66.64%,#0644B3 66.64%, 83.3%,#C22EDC 83.3%);';

<<<<<<< HEAD
const darkShadedBackground = lighten('#303030', 0.2);
const darkDoubleShadedBackground = lighten(darkShadedBackground, 0.2);

const lightShadedBackground = darken('#fafafa', 0.3);
const lightDoubleShadedBackground = darken(lightShadedBackground, 0.3);

export const theme = extendTheme({
=======
export const theme = createTheme({
	cssVariables: {
		colorSchemeSelector: 'class',
	},
>>>>>>> 1856c987 (chore: theme handling)
	colorSchemes: {
		dark: {
			palette: {
				common: {
					pride,
					red: red.A400,
					green: lightGreen[600],
					yellow: yellow[400],
					orange: orange[400],
					blue: blue[400],
					shadedBackground: darkShadedBackground,
					doubleShadedBackground: darkDoubleShadedBackground,
					transparentBackground: 'rgba(0, 0, 0, 0.55)',
				},
				mode: 'dark',
				background: {
					default: '#303030',
				},
				primary: {
					main: blue[700],
				},
				secondary: {
					main: purple.A400,
				},
			},
		},
		light: {
			palette: {
				common: {
					pride,
					red: red[700],
					green: green[800],
					yellow: yellow[600],
					orange: orange[400],
					blue: indigo[800],
					shadedBackground: lightShadedBackground,
					doubleShadedBackground: lightDoubleShadedBackground,
					transparentBackground: 'rgba(255, 255, 255, 0.55)',
				},
				mode: 'light',
				background: {
					default: '#fafafa',
				},
				primary: {
					main: blue[400],
				},
				secondary: {
					main: purple[400],
				},
			},
		},
	},
	shape: {
		headerSpacing: `${headerSpacing}em`,
	},
	components: {
		MuiTextField: {
			defaultProps: {
				variant: 'standard',
			},
		},
		MuiToolbar: {
			styleOverrides: {
				regular: {
					height: `${headerSpacing}em!important`,
					minHeight: `${headerSpacing}em!important`,
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundImage: 'unset',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				elevation1: {
					backgroundColor: 'inherit',
					backgroundImage: 'unset',
					boxShadow: '0 1px 0 rgba(0, 0, 0, 0.24)',
				},
			},
		},
	},
});
