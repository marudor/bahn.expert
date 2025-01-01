import { ThemeHeaderTags } from '@/client/Common/Components/ThemeHeaderTags';
import { RPCProvider } from '@/client/RPC';
import { theme } from '@/client/Themes';
import type { EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// @ts-expect-error ESM fuckup
import { deDE } from '@mui/x-date-pickers/node/locales/deDE';
import { de as deLocale } from 'date-fns/locale/de';
import type { ReactElement, ReactNode } from 'react';
import { App } from './App';

interface Props {
	children?: ReactNode;
	// generateClassName?: ReturnType<typeof createGenerateClassName>;
	emotionCache?: EmotionCache;
}

const customDeLocaleText: typeof deDE.components.MuiLocalizationProvider.defaultProps.localeText =
	{
		...deDE.components.MuiLocalizationProvider.defaultProps.localeText,
		clearButtonLabel: 'Jetzt',
	};

export const ThemeWrap = ({ children = <App /> }: Props): ReactElement => {
	return (
		<RPCProvider>
			<ThemeProvider theme={theme}>
				<LocalizationProvider
					dateAdapter={AdapterDateFns}
					adapterLocale={deLocale}
					localeText={customDeLocaleText}
				>
					<ThemeHeaderTags />
					{children}
				</LocalizationProvider>
			</ThemeProvider>
		</RPCProvider>
	);
};
