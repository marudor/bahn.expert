import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import { ReactNode, useContext } from 'react';
import ActionMenu from '@material-ui/icons/Menu';
import HeaderTags from './HeaderTags';
import NavigationContext from 'client/Common/Components/Navigation/NavigationContext';

interface Props {
  children: ReactNode;
}

const BaseHeader = ({ children }: Props) => {
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
          <ActionMenu color="inherit" />
        </IconButton>
        {children}
      </Toolbar>
    </AppBar>
  );
};

export default BaseHeader;
