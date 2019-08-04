import { __RouterContext } from 'react-router';
import { fav, unfav } from 'Abfahrten/actions/fav';
import { getLageplan, openFilter } from 'Abfahrten/actions/abfahrten';
import { IconButton } from '@material-ui/core';
import { openSettings } from 'Abfahrten/actions/abfahrtenConfig';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAbfahrtenSelector } from 'useSelector';
import ActionMenu from '@material-ui/icons/Menu';
import FilterList from '@material-ui/icons/FilterList';
import FilterModal from './FilterModal';
import Layers from '@material-ui/icons/Layers';
import LayersClear from '@material-ui/icons/LayersClear';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import Settings from '@material-ui/icons/Settings';
import ToggleStar from '@material-ui/icons/Star';
import ToggleStarBorder from '@material-ui/icons/StarBorder';

const ExtraMenu = () => {
  const { isFaved, currentStation, lageplan } = useAbfahrtenSelector(
    state => ({
      isFaved: Boolean(
        state.abfahrten.currentStation &&
          state.fav.favs[state.abfahrten.currentStation.id]
      ),
      currentStation: state.abfahrten.currentStation,
      lageplan: state.abfahrten.lageplan,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();
  const [anchor, setAnchor] = useState<undefined | HTMLElement>();
  const toggleFav = useCallback(() => {
    setAnchor(undefined);
    if (currentStation) {
      if (isFaved) {
        dispatch(unfav(currentStation));
      } else {
        dispatch(fav(currentStation));
      }
    }
  }, [currentStation, dispatch, isFaved]);
  const toggleMenu = useCallback(
    (e: SyntheticEvent<HTMLElement>) => {
      setAnchor(anchor ? undefined : e.currentTarget);
    },
    [anchor]
  );
  const openLageplan = useCallback(async () => {
    setAnchor(undefined);
    if (lageplan === undefined && currentStation) {
      const fetchedLageplan: any = await dispatch(
        getLageplan(currentStation.title)
      );

      if (fetchedLageplan) {
        window.open(fetchedLageplan, '_blank');
      }
    } else if (lageplan) {
      window.open(lageplan, '_blank');
    }
  }, [currentStation, dispatch, lageplan]);
  const openFilterCb = useCallback(() => {
    dispatch(openFilter());
    setAnchor(undefined);
  }, [dispatch]);
  const openSettingsCb = useCallback(() => {
    dispatch(openSettings());
    setAnchor(undefined);
  }, [dispatch]);

  return (
    <>
      <FilterModal />
      <IconButton
        data-testid="menu"
        aria-label="Menu"
        onClick={toggleMenu}
        color="inherit"
      >
        <ActionMenu />
      </IconButton>
      <Menu open={Boolean(anchor)} anchorEl={anchor} onClose={toggleMenu}>
        {currentStation && [
          <MenuItem data-testid="toggleFav" key="1" onClick={toggleFav}>
            {isFaved ? (
              <>
                <ToggleStar /> Unfav
              </>
            ) : (
              <>
                <ToggleStarBorder /> Fav
              </>
            )}
          </MenuItem>,
          <MenuItem data-testid="lageplan" key="2" onClick={openLageplan}>
            {lageplan !== null ? <Layers /> : <LayersClear />} Lageplan
          </MenuItem>,
        ]}
        <MenuItem data-testid="openFilter" onClick={openFilterCb}>
          <FilterList /> Filter
        </MenuItem>
        <MenuItem data-testid="openSettings" onClick={openSettingsCb}>
          <Settings /> Settings
        </MenuItem>
      </Menu>
    </>
  );
};

export default ExtraMenu;
