import { AppBar, IconButton, Toolbar } from '@mui/material';
import { HeaderTags } from './HeaderTags';
import { Menu } from '@mui/icons-material';
import { NavigationContext } from 'client/Common/Components/Navigation/NavigationContext';
import { useContext } from 'react';
import styled from '@emotion/styled';
import type { FC, PropsWithChildren } from 'react';

const NotchFix = styled.div(({ theme }) => ({
  top: '-5em',
  height: '5em',
  width: '100%',
  position: 'fixed',
  background: theme.palette.background.default,
}));

export const BaseHeader: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { toggleDrawer } = useContext(NavigationContext);

  return (
    <>
      <NotchFix />
      <AppBar enableColorOnDark position="fixed" data-testid="header">
        <HeaderTags />
        <Toolbar disableGutters>
          <IconButton
            data-testid="navToggle"
            aria-label="Menu"
            onClick={toggleDrawer}
            color="inherit"
          >
            <Menu color="inherit" />
          </IconButton>
          {children}
        </Toolbar>
      </AppBar>
    </>
  );
};
