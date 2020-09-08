import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import { HeaderTags } from './HeaderTags';
import { Menu } from '@material-ui/icons';
import { NavigationContext } from 'client/Common/Components/Navigation/NavigationContext';
import { useContext } from 'react';
import type { FC } from 'react';

export const BaseHeader: FC = ({ children }) => {
  const { toggleDrawer } = useContext(NavigationContext);

  return (
    <AppBar position="fixed" data-testid="header">
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
  );
};
