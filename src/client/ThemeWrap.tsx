import { ThemeHeaderTags } from '@/client/Common/Components/ThemeHeaderTags';
import { RPCProvider } from '@/client/RPC';
import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/react';
import { StyledEngineProvider } from '@mui/material';
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

const defaultEmotionCache = createEmotionCache({ key: 'css', prepend: true });

export const ThemeWrap = ({
	children = <App />,
	emotionCache = defaultEmotionCache,
}: Props): ReactElement => {
	return (
		<RPCProvider>
			<StyledEngineProvider injectFirst>
				<LocalizationProvider
					dateAdapter={AdapterDateFns}
					adapterLocale={deLocale}
					localeText={customDeLocaleText}
				>
					<CacheProvider value={emotionCache}>
						<ThemeHeaderTags />
						{children}
					</CacheProvider>
				</LocalizationProvider>
			</StyledEngineProvider>
		</RPCProvider>
	);
};
