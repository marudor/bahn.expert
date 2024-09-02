import { theme } from '@/client/Themes';
import { ThemeProvider as UpstreamTheamProvider } from '@mui/material/styles';

export const ThemeProvider: FCC = ({ children }) => (
	<UpstreamTheamProvider theme={theme}>{children}</UpstreamTheamProvider>
);
