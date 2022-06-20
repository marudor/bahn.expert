import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { App } from './App';
import { CacheProvider } from '@emotion/react';
import { deDE } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material';
import { ThemeHeaderTags } from 'client/Common/Components/ThemeHeaderTags';
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'client/Common/provider/ThemeProvider';
import createEmotionCache from '@emotion/cache';
import deLocale from 'date-fns/locale/de';
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

export const ThemeWrap = ({
  children = <App />,
  // generateClassName,
  emotionCache = createEmotionCache({
    key: 'css',
  }),
}: Props): ReactElement => {
  const { theme } = useTheme();

  return (
    <StyledEngineProvider injectFirst>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={deLocale}
        localeText={customDeLocaleText}
      >
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <ThemeHeaderTags />
            {children}
          </ThemeProvider>
        </CacheProvider>
      </LocalizationProvider>
    </StyledEngineProvider>
  );
};
