import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { getInitColorSchemeScript } from '@mui/material/styles';
import { theme } from '@/client/Themes';

export const ThemeProvider: FCC = ({ children }) => (
  <CssVarsProvider theme={theme}>
    {getInitColorSchemeScript()}
    {children}
  </CssVarsProvider>
);
