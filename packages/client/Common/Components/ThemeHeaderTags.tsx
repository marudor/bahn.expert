import { Helmet } from 'react-helmet-async';
import { useTheme } from '@material-ui/core';

export const ThemeHeaderTags = () => {
  const theme = useTheme();

  return (
    <Helmet>
      <meta name="theme-color" content={theme.palette.background.default} />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Helmet>
  );
};
