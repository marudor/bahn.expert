import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@material-ui/core';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import AlarmOnOutlinedIcon from '@material-ui/icons/AlarmOnOutlined';
import ExploreIcon from '@material-ui/icons/Explore';
import InfoIcon from '@material-ui/icons/Info';
import NavigationContext from './NavigationContext';
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components/macro';
import ThemeSelection from './ThemeSelection';
import Zugsuche from 'client/Common/Components/Zugsuche';

const Headline = styled.h3`
  text-align: center;
`;

const Drawer = styled(List)`
  width: 230px;
  a {
    color: inherit;
  }
  .MuiListItem-button {
    padding: 20px 20px;
  }
`;

interface Props {
  children: ReactNode;
}

const Navigation = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
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
        <Headline>BahnhofsAbfahrten</Headline>
        <Drawer onClick={toggleDrawer}>
          <Link to="/">
            <ListItem button>
              <ListItemIcon>
                <AlarmOnOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Abfahrten" />
            </ListItem>
          </Link>
          <Link to="/regional">
            <ListItem button data-testid="regional">
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
        </Drawer>
      </SwipeableDrawer>
      {children}
    </NavigationContext.Provider>
  );
};

export default Navigation;
