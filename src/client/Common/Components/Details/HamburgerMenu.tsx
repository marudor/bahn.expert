import { IconButton } from '@material-ui/core';
import { openTheme } from 'Common/actions/config';
import { useDispatch } from 'react-redux';
import { useRouter } from 'useRouter';
import ActionMenu from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import Zugsuche from '../Zugsuche';

const HamurgerMenu = () => {
  const [anchor, setAnchor] = useState<undefined | HTMLElement>();
  const { history } = useRouter();
  const toPage = useCallback(
    (to: string) => {
      history.push(to);
      setAnchor(undefined);
    },
    [history]
  );
  const dispatch = useDispatch();
  const toggleMenu = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      setAnchor(anchor ? undefined : e.currentTarget);
    },
    [anchor]
  );

  return (
    <>
      <IconButton aria-label="Menu" onClick={toggleMenu} color="inherit">
        <ActionMenu />
      </IconButton>
      <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={toggleMenu}>
        <MenuItem onClick={() => toPage('/')}>Home</MenuItem>
        <MenuItem onClick={() => toPage('/routing')}>Routing</MenuItem>
        <MenuItem onClick={() => dispatch(openTheme())}>Theme</MenuItem>
        <Zugsuche noIcon onClose={toggleMenu} />
      </Menu>
    </>
  );
};

export default HamurgerMenu;
