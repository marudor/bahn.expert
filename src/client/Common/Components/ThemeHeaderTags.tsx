import { Helmet } from 'react-helmet-async';
import { MergedTheme, useTheme } from '@material-ui/styles';
import React from 'react';

const ThemeHeaderTags = () => {
  const theme = useTheme<MergedTheme>();

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

export default ThemeHeaderTags;
