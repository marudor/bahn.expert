import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import ActionMenu from '@material-ui/icons/Menu';
import NavigationContext from 'Common/Components/Navigation/NavigationContext';
import React, { ReactNode, useContext } from 'react';

interface Props {
  children: ReactNode;
}

const BaseHeader = ({ children }: Props) => {
  const { toggleDrawer } = useContext(NavigationContext);

  return (
    <AppBar position="fixed">
      <Toolbar disableGutters>
        <IconButton
          data-testid="navToggle"
          aria-label="Menu"
          onClick={toggleDrawer}
          color="inherit"
        >
          <ActionMenu color="inherit" />
        </IconButton>
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default BaseHeader;
