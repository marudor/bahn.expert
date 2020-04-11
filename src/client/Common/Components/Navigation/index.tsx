import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@material-ui/core';
import AlarmOnOutlinedIcon from '@material-ui/icons/AlarmOnOutlined';
import ExploreIcon from '@material-ui/icons/Explore';
import InfoIcon from '@material-ui/icons/Info';
import NavigationContext from './NavigationContext';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import ThemeSelection from './ThemeSelection';
import useStyles from './index.style';
import Zugsuche from 'Common/Components/Zugsuche';

interface Props {
  children: ReactNode;
}

const Navigation = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const toggleDrawer = useCallback(() => {
    setOpen(!open);
  }, [open]);
  const navigationContext = useMemo(
    () => ({
      toggleDrawer,
    }),
    [toggleDrawer]
  );

  return (
    <NavigationContext.Provider value={navigationContext}>
      <SwipeableDrawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <h3 className={classes.header}>BahnhofsAbfahrten</h3>
        <List className={classes.drawer} onClick={toggleDrawer}>
          <Link to="/">
            <ListItem button>
              <ListItemIcon>
                <AlarmOnOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Abfahrten" />
            </ListItem>
          </Link>
          <Link to="/regional">
            <ListItem button>
              <ListItemIcon>
                <AlarmOnOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Nahverkehr Abfahrten" />
            </ListItem>
          </Link>
          <Link to="/routing">
            <ListItem button>
              <ListItemIcon>
                <ExploreIcon />
              </ListItemIcon>
              <ListItemText primary="Routing" />
            </ListItem>
          </Link>
          <Zugsuche>
            {(toggle) => (
              <ListItem button onClick={toggle}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="Zugsuche" />
              </ListItem>
            )}
          </Zugsuche>
          <ThemeSelection />
          <Link to="/about">
            <ListItem button>
              <ListItemIcon>
                <InfoIcon />
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

export default Navigation;
