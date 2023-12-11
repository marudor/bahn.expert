import {
  AlarmOnOutlined,
  Explore,
  Info,
  Search,
  Settings,
} from '@mui/icons-material';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { NavigationContext } from './NavigationContext';
import { SettingsModal } from '@/client/Common/Components/SettingsModal';
import { ThemeSelection } from './ThemeSelection';
import { useCallback, useMemo, useState } from 'react';
import { useSetCommonConfigOpen } from '@/client/Common/provider/CommonConfigProvider';
import { Zugsuche } from '@/client/Common/Components/Zugsuche';
import styled from '@emotion/styled';
import type { FC, ReactNode } from 'react';

const Headline = styled.h3`
  text-align: center;
`;

const DrawerContent = styled(List)`
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
  const setConfigOpen = useSetCommonConfigOpen();
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

  const openSettingsCb = useCallback(() => {
    setConfigOpen(true);
  }, [setConfigOpen]);

  return (
    <>
      <SettingsModal />
      <NavigationContext.Provider value={navigationContext}>
        <Drawer open={open} onClose={toggleDrawer}>
          <Headline>Bahn Experte</Headline>
          <DrawerContent onClick={toggleDrawer}>
            <Link to="/">
              <ListItemButton>
                <ListItemIcon>
                  <AlarmOnOutlined />
                </ListItemIcon>
                <ListItemText primary="Abfahrten" />
              </ListItemButton>
            </Link>
            <Link to="/regional">
              <ListItemButton data-testid="regional">
                <ListItemIcon>
                  <AlarmOnOutlined />
                </ListItemIcon>
                <ListItemText primary="Nahverkehr Abfahrten" />
              </ListItemButton>
            </Link>
            <Link to="/routing">
              <ListItemButton>
                <ListItemIcon>
                  <Explore />
                </ListItemIcon>
                <ListItemText primary="Routing" />
              </ListItemButton>
            </Link>
            <Zugsuche>
              {(toggle) => (
                <ListItemButton onClick={toggle}>
                  <ListItemIcon>
                    <Search />
                  </ListItemIcon>
                  <ListItemText primary="Zugsuche" />
                </ListItemButton>
              )}
            </Zugsuche>
            <ListItemButton data-testid="openSettings" onClick={openSettingsCb}>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Einstellungen" />
            </ListItemButton>
            <ThemeSelection />
            <Link to="/about">
              <ListItemButton>
                <ListItemIcon>
                  <Info />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItemButton>
            </Link>
          </DrawerContent>
        </Drawer>
        {children}
      </NavigationContext.Provider>
    </>
  );
};
