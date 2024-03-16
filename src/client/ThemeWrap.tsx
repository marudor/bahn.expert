import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { App } from './App';
// eslint-disable-next-line no-restricted-imports
import { CacheProvider } from '@emotion/react';
import { deDE } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material';
import { ThemeHeaderTags } from '@/client/Common/Components/ThemeHeaderTags';
import { ThemeProvider } from '@/client/Themes/Provider';
import createEmotionCache from '@emotion/cache';
import deLocale from 'date-fns/locale/de';
// eslint-disable-next-line no-restricted-imports
import type { EmotionCache } from '@emotion/react';
import type { ReactElement, ReactNode } from 'react';

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
    <StyledEngineProvider injectFirst>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={deLocale}
        localeText={customDeLocaleText}
      >
        <CacheProvider value={emotionCache}>
          <ThemeProvider>
            <ThemeHeaderTags />
            {children}
          </ThemeProvider>
        </CacheProvider>
      </LocalizationProvider>
    </StyledEngineProvider>
  );
};
