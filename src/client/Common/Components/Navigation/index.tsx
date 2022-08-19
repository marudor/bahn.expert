import {
  AlarmOnOutlined,
  Explore,
  Info,
  Search,
  Train,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
} from '@mui/material';
import { NavigationContext } from './NavigationContext';
import { ThemeSelection } from './ThemeSelection';
import { useCallback, useMemo, useState } from 'react';
import { Zugsuche } from 'client/Common/Components/Zugsuche';
import styled from '@emotion/styled';
import type { FC, ReactNode } from 'react';

const Headline = styled.h3`
  text-align: center;
`;

const Drawer = styled(List)`
  width: 230px;
  overflow-x: hidden;
  & a {
    color: inherit;
  }
  & .MuiListItem-button {
    padding: 20px 20px;
  }
`;

interface Props {
  children: ReactNode;
}

export const Navigation: FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = useCallback(() => {
    setOpen((old) => !old);
  }, []);
  const navigationContext = useMemo(
    () => ({
      toggleDrawer,
    }),
    [toggleDrawer],
  );

  return (
    <NavigationContext.Provider value={navigationContext}>
      <SwipeableDrawer open={open} onClose={toggleDrawer} onOpen={toggleDrawer}>
        <Headline>Bahn Experte</Headline>
        <Drawer onClick={toggleDrawer}>
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
          <Link to="/trainRuns">
            <ListItem button>
              <ListItemIcon>
                <Train />
              </ListItemIcon>
              <ListItemText primary="Zugläufe" />
            </ListItem>
          </Link>
          <ThemeSelection />
          <Link to="/about">
            <ListItem button>
              <ListItemIcon>
                <Info />
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
