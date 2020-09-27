import { AppBar, IconButton, makeStyles, Toolbar } from '@material-ui/core';
import { HeaderTags } from './HeaderTags';
import { Menu } from '@material-ui/icons';
import { NavigationContext } from 'client/Common/Components/Navigation/NavigationContext';
import { useContext } from 'react';
import type { FC } from 'react';

const useStyles = makeStyles((theme) => ({
  notchFix: {
    top: '-5em',
    height: '5em',
    width: '100%',
    position: 'fixed',
    background: theme.palette.background.default,
  },
}));

export const BaseHeader: FC = ({ children }) => {
  const { toggleDrawer } = useContext(NavigationContext);
  const classes = useStyles();

  return (
    <>
      <div className={classes.notchFix} />
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
    </>
  );
};
