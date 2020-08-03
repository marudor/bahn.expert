import { AlarmOnOutlined, Explore, Info, Search } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  SwipeableDrawer,
} from '@material-ui/core';
import { NavigationContext } from './NavigationContext';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { ThemeSelection } from './ThemeSelection';
import { Zugsuche } from 'client/Common/Components/Zugsuche';

const useStyles = makeStyles({
  headline: {
    textAlign: 'center',
  },
  drawer: {
    width: 230,
    '& a': {
      color: 'inherit',
    },
    '& .MuiListItem-button': {
      padding: '20px 20px',
    },
  },
});

interface Props {
  children: ReactNode;
}

export const Navigation = ({ children }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const toggleDrawer = useCallback(() => {
    setOpen((old) => !old);
  }, []);
  const navigationContext = useMemo(
    () => ({
      toggleDrawer,
    }),
    [toggleDrawer]
  );

  return (
    <NavigationContext.Provider value={navigationContext}>
      <SwipeableDrawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <h3 className={classes.headline}>BahnhofsAbfahrten</h3>
        <List className={classes.drawer} onClick={toggleDrawer}>
          <Link to="/">
            <ListItem button>
              <ListItemIcon>
                <AlarmOnOutlined />
              </ListItemIcon>
              <ListItemText primary="Abfahrten" />
            </ListItem>
          </Link>
          <Link to="/regional">
            <ListItem button data-testid="regional">
              <ListItemIcon>
                <AlarmOnOutlined />
              </ListItemIcon>
              <ListItemText primary="Nahverkehr Abfahrten" />
            </ListItem>
          </Link>
          <Link to="/routing">
            <ListItem button>
              <ListItemIcon>
                <Explore />
              </ListItemIcon>
              <ListItemText primary="Routing" />
            </ListItem>
          </Link>
          <Zugsuche>
            {(toggle) => (
              <ListItem button onClick={toggle}>
                <ListItemIcon>
                  <Search />
                </ListItemIcon>
                <ListItemText primary="Zugsuche" />
              </ListItem>
            )}
          </Zugsuche>
          <ThemeSelection />
          <Link to="/about">
            <ListItem button>
              <ListItemIcon>
                <Info />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
          </Link>
        </List>
      </SwipeableDrawer>
      {children}
    </NavigationContext.Provider>
  );
};
