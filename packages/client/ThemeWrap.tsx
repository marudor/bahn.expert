import { App } from './App';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/lab';
import { StyledEngineProvider } from '@mui/material';
import { ThemeHeaderTags } from 'client/Common/Components/ThemeHeaderTags';
import { ThemeProvider } from '@mui/material';
import { useTheme } from 'client/Common/provider/ThemeProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import createEmotionCache from '@emotion/cache';
import deLocale from 'date-fns/locale/de';
import type { EmotionCache } from '@emotion/react';
import type { ReactElement, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  // generateClassName?: ReturnType<typeof createGenerateClassName>;
  emotionCache?: EmotionCache;
}

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
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
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
