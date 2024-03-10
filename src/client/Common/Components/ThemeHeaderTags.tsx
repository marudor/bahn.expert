import { Meta } from 'react-head';
import { useTheme } from '@mui/material';
import type { FC } from 'react';

export const ThemeHeaderTags: FC = () => {
  const theme = useTheme();

  return (
    <>
      <Meta
        name="theme-color"
        content={theme.vars.palette.background.default}
      />
      <Meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <Meta name="apple-mobile-web-app-capable" content="yes" />
    </>
  );
};
