import { RouteComponentProps, withRouter } from 'react-router-dom';
import ActionHome from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { SyntheticEvent, useCallback, useState } from 'react';

const HomeMenu = ({ history }: RouteComponentProps) => {
  const [anchor, setAnchor] = useState<undefined | HTMLElement>(undefined);

  const toggleMenu = useCallback(
    (e: SyntheticEvent<HTMLElement>) =>
      setAnchor(anchor ? undefined : e.currentTarget),
    [anchor]
  );
  const toAbfahrten = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      history.push('/');
      toggleMenu(e);
    },
    [history, toggleMenu]
  );
  const toRouting = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      history.push('/routing');
      toggleMenu(e);
    },
    [history, toggleMenu]
  );

  return (
    <>
      <IconButton aria-label="Home" onClick={toggleMenu} color="inherit">
        <ActionHome color="inherit" />
      </IconButton>
      <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={toggleMenu}>
        <MenuItem onClick={toAbfahrten}>Abfahrten</MenuItem>
        <MenuItem onClick={toRouting}>Routing (WIP)</MenuItem>
      </Menu>
    </>
  );
};

export default withRouter(HomeMenu);
